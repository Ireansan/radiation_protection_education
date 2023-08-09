import * as THREE from "three";

import { DoseBase } from "./doseBase";
import { DoseObject } from "./doseObject";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 *
 * @abstract Volume Group
 */
class DoseGroup extends DoseBase {
    isGroup: boolean;
    type: string;

    constructor() {
        super();

        this.isGroup = true;
        this.type = "Group";
    }

    updateVolumeClipping(updateParents: boolean, updateChildren: boolean) {
        // ----------
        // update parent, children
        // ----------
        super.updateVolumeClipping(updateParents, updateChildren);

        // ----------
        // update children that is THREE.Mesh
        // ----------
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
    getVolumeValues(position: THREE.Vector3): number[] {
        return this.children.map(
            (child, i) =>
                child instanceof DoseObject
                    ? child.getVolumeValue(position.clone())
                    : -1 // NaN
        );
    }
}

export { DoseGroup };
