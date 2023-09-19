import * as THREE from "three";
import { VolumeBase } from "./core";
import { DoseBase } from "./dose";
import type { DoseValue } from "./dose";

export type SpecifiedSite = {
    name: string;
    displayName?: string;
    category?: string;
    coefficient?: number;
};

export type ResultsByName = SpecifiedSite & {
    dose: DoseValue[];
};
/**
 *
 */
class Dosimeter extends DoseBase {
    object: THREE.Object3D | undefined;
    _namesData: SpecifiedSite[] | undefined;
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
    set namesData(nameList: SpecifiedSite[] | undefined) {
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

    getValueByName(objectByName: THREE.Object3D | undefined): DoseValue[] {
        let tmpResults: DoseValue[] = new Array();

        if (this.targets && objectByName) {
            // ----------
            // world position by name
            // ----------
            let position = new THREE.Vector3();
            objectByName.getWorldPosition(position);

            // ----------
            // within boundaries
            // ----------
            const within_boundaries = (target: DoseBase) => {
                let boards = target.totalClippingPlanesObjects.filter(
                    (element) => element.isType === "board"
                );

                let planes: THREE.Plane[];
                let guarded = false;
                for (let i = 0; i < boards.length; i++) {
                    let board = boards[i];
                    planes = board.planes;

                    let plane: THREE.Plane;
                    let tmpGuarded = true;
                    for (let j = 0; j < planes.length; j++) {
                        plane = planes[j];

                        let tmpPosition = position.clone().multiplyScalar(-1);
                        tmpGuarded =
                            tmpGuarded &&
                            tmpPosition.dot(plane.normal) > plane.constant;
                    }

                    guarded = guarded || tmpGuarded;
                }

                guarded = guarded && target.boardEffect;

                return guarded;
            };

            const getResult = (target: DoseBase): DoseValue => {
                let coefficient = target.boardCoefficient;
                let offset = target.boardOffset;
                let volumeValue = target.getVolumeValue(position);
                let guarded = within_boundaries(target);

                return {
                    data: guarded
                        ? coefficient * volumeValue + offset
                        : volumeValue,
                    state: guarded ? ["shield"] : [],
                };
            };

            // ----------
            // each result
            // ----------
            tmpResults = this.targets
                .filter((value) => value?.visible === true)
                .map((target) => {
                    return target
                        ? target instanceof DoseBase
                            ? getResult(target)
                            : { data: NaN, state: undefined } // NaN
                        : { data: NaN, state: undefined }; // NaN
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
                    category: data.category,
                    coefficient: data.coefficient,
                    dose: this.getValueByName(this.objectsByName[index]),
                };
            });
        }
    }
}

export { Dosimeter };
