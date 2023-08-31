import * as THREE from "three";
import { VolumeBase } from "./core";
import { DoseObject, DoseAnimationObject } from "./dose";

export type Names = {
    name: string;
    displayName?: string;
};
export type ResultsByName = Names & {
    data: number[];
};
/**
 *
 */
class Dosimeter extends VolumeBase {
    object: THREE.Object3D | undefined;
    _namesData: Names[] | undefined;
    targets: (VolumeBase | undefined)[] | undefined;

    objectsByName: (THREE.Object3D | undefined)[];
    results: ResultsByName[];

    isDoseControls: boolean;

    constructor() {
        super();

        this.targets = undefined;
        this._namesData = undefined;
        this.object = undefined;

        this.objectsByName = [];
        this.results = [];

        this.visible = false;

        this.isDoseControls = true;
    }

    get namesData() {
        return this._namesData;
    }
    set namesData(nameList: Names[] | undefined) {
        this._namesData = nameList;
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
        this._namesData = undefined;
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
        if (this._namesData) {
            this.objectsByName = this._namesData.map((data) =>
                this.object?.getObjectByName(data.name)
            );
        }
    }

    getValueByName(objectByName: THREE.Object3D | undefined): number[] {
        let tmpResults: number[] = new Array();
        if (this.targets && objectByName) {
            let position = new THREE.Vector3();
            objectByName.getWorldPosition(position);

            tmpResults = this.targets.map((target) => {
                return target
                    ? target instanceof DoseObject ||
                      target instanceof DoseAnimationObject
                        ? target.getVolumeValue(position)
                        : -1 // NaN
                    : -1; // NaN
            });
        }

        return tmpResults;
    }
    updateResults() {
        this.results = [];

        if (this._namesData) {
            this.results = this._namesData.map((data, index) => {
                return {
                    name: data.name,
                    displayName: data.displayName,
                    data: this.getValueByName(this.objectsByName[index]),
                };
            });
        }
    }
}

export { Dosimeter };
