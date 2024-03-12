import * as THREE from "three";

import { VolumeBase } from "./volumeBase";
import { VolumeObject } from "./volumeObject";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 *
 * @abstract Volume Group
 */
class VolumeGroup extends VolumeBase {
    // ==================================================
    // Type Declaration
    isGroup: boolean;
    type: string;

    // ==================================================
    // Constructor
    constructor(isDose = false) {
        super(isDose);

        this.isGroup = true;
        this.type = "Group";
    }

    // ==================================================
    // Method
    updateVolumeClipping(updateParents: boolean, updateChildren: boolean) {
        // =========================
        // update parent, children
        super.updateVolumeClipping(updateParents, updateChildren);

        // =========================
        // update children that is THREE.Mesh
        if (updateChildren === true) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (child instanceof THREE.Mesh) {
                    child.material.clipping = this._clipping;
                    child.material.clippingPlanes = this._clipping
                        ? this._clippingPlanes
                        : null;
                    child.material.clipIntersection = this._clipIntersection;
                }
            }
        }
    }

    /**
     *
     * @param position world position
     * @returns value in the data array
     */
    getVolumeValue(position: THREE.Vector3): number {
        let results = this.children.map((child, i) =>
            child instanceof VolumeObject
                ? child.getVolumeValue(position.clone())
                : -6
        );

        let tmpData = results.reduce(
            (acculator, currentValue) => acculator + currentValue,
            0
        );

        // https://stackoverflow.com/questions/44436041/how-to-sum-value-of-two-json-object-key
        return tmpData;
    }

    /**
     *
     * @param position world position
     * @returns value in the data array
     */
    getVolumeValues(position: THREE.Vector3): number[] {
        return this.children.map((child, i) =>
            child instanceof VolumeObject ? child.getVolumeValue(position) : NaN
        );
    }
}

export { VolumeGroup };
