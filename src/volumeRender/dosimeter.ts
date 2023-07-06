import * as THREE from "three";
import {
    VolumeAnimationObject,
    VolumeBase,
    VolumeGroup,
    VolumeObject,
} from "./core";

type ResultsByName = {
    name: string;
    data: (number | number[])[];
};
/**
 *
 */
class Dosimeter extends VolumeBase {
    object: THREE.Object3D | undefined;
    _names: string[] | undefined;
    targets: (VolumeBase | undefined)[] | undefined;

    objectsByName: (THREE.Object3D | undefined)[];
    results: ResultsByName[];

    isDoseControls: boolean;

    constructor() {
        super();

        this.targets = undefined;
        this._names = undefined;
        this.object = undefined;

        this.objectsByName = [];
        this.results = [];

        this.visible = false;

        this.isDoseControls = true;
    }

    get names() {
        return this._names;
    }
    set names(nameList: string[] | undefined) {
        this._names = nameList;
        this.updateObjectsByName();
    }

    attach(object: THREE.Object3D<THREE.Event>) {
        this.object = object;
        this.visible = true;
        this.updateObjectsByName();

        return this;
    }
    detach() {
        this.object = undefined;
        this.names = undefined;
        this.visible = false;

        return this;
    }

    attachTargets(targets: VolumeBase[]) {
        this.targets = targets;

        return this;
    }
    detachTargets() {
        this.targets = undefined;

        return this;
    }

    updateObjectsByName() {
        if (this._names) {
            this.objectsByName = this._names.map((name) =>
                this.object?.getObjectByName(name)
            );
        }
    }

    getValueByName(
        objectByName: THREE.Object3D | undefined
    ): (number | number[])[] {
        let tmpResults: (number | number[])[] = new Array();
        if (this.targets && objectByName) {
            let position = new THREE.Vector3();
            objectByName.getWorldPosition(position);

            tmpResults = this.targets.map((target) => {
                return target
                    ? target instanceof VolumeObject ||
                      target instanceof VolumeAnimationObject
                        ? target.getVolumeValue(position)
                        : target instanceof VolumeGroup
                        ? target.getVolumeValues(position)
                        : NaN
                    : NaN;
            });
        }

        return tmpResults;
    }
    updateResults() {
        this.results = [];

        if (this._names) {
            this.results = this._names.map((name, index) => {
                return {
                    name: name,
                    data: this.getValueByName(this.objectsByName[index]),
                };
            });
        }
    }
}

export { Dosimeter };
