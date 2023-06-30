import * as THREE from "three";
import { VolumeBase } from "./core";

/**
 *
 */
class Dosimeter extends VolumeBase {
    object: THREE.Object3D | undefined;
    names: string[] | undefined;
    targets: (VolumeBase | undefined)[] | undefined;
    results: number[]; // FIXME: will change type "number" to custom class

    regionId: number | undefined;

    isDoseControls: boolean;

    constructor() {
        super();

        this.targets = undefined;
        this.names = undefined;
        this.object = undefined;
        this.results = [];

        this.visible = false;

        this.isDoseControls = true;
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

    updateResults() {
        // TODO:
    }
}

export { Dosimeter };
