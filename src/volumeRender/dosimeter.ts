import * as THREE from "three";
import {
    VolumeAnimationObject,
    VolumeBase,
    VolumeGroup,
    VolumeObject,
} from "./core";

type ResultsByName = {
    name: string;
    data: number | number[];
};
/**
 *
 */
class Dosimeter extends VolumeBase {
    object: THREE.Object3D | undefined;
    _names: string[] | undefined;
    targets: (VolumeBase | undefined)[] | undefined;

    results: ResultsByName[];

    isDoseControls: boolean;

    constructor() {
        super();

        this.targets = undefined;
        this._names = undefined;
        this.object = undefined;

        this.results = [];

        this.visible = false;

        this.isDoseControls = true;
    }

    get names() {
        return this._names;
    }
    set names(nameList: string[] | undefined) {
        this._names = nameList;
    }

    attach(object: THREE.Object3D<THREE.Event>) {
        this.object = object;
        this.visible = true;

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

    getValueByName(name: string | undefined): number | number[] {
        let objectByName: THREE.Object3D | undefined;

        if (this.object) {
            objectByName = this.object;
            if (name) {
                objectByName = this.object.getObjectByName(name);
            }
        }

        if (this.targets && objectByName) {
            let position = new THREE.Vector3();
            objectByName.getWorldPosition(position);

            for (let i = 0; i < this.targets.length; i++) {
                let target = this.targets[i];
                return target
                    ? target instanceof VolumeObject ||
                      target instanceof VolumeAnimationObject
                        ? target.getVolumeValue(position)
                        : target instanceof VolumeGroup
                        ? target.getVolumeValues(position)
                        : NaN
                    : NaN;
            }
        }

        return NaN;
    }
    updateResults() {
        this.results = [];

        if (this._names) {
            for (let i = 0; i < this._names.length; i++) {
                let name = this._names[i];
                this.results.push({
                    name: name,
                    data: this.getValueByName(name),
                });
            }
        }
    }
}

export { Dosimeter };
