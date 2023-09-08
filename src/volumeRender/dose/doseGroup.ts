import * as THREE from "three";

import { DoseBase } from "./doseBase";
import { DoseObject } from "./doseObject";
import type { DoseValue } from "./doseBase";

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
    getVolumeValue(position: THREE.Vector3): DoseValue {
        let results = this.children.map((child, i) =>
            child instanceof DoseObject
                ? child.getVolumeValue(position.clone())
                : { data: 0, state: undefined }
        );

        let tmpData = results
            .map((result) => result.data)
            .reduce((acculator, currentValue) => acculator + currentValue, 0);

        let tmpState: string[] = [];
        results.map((result) =>
            result.state ? tmpState.concat(result.state) : null
        );

        return {
            // https://stackoverflow.com/questions/44436041/how-to-sum-value-of-two-json-object-key
            data: tmpData,
            state: Array.from(new Set(tmpState)),
        };
    }

    /**
     *
     * @param position world position
     * @returns value in the data array
     */
    getVolumeValues(position: THREE.Vector3): DoseValue[] {
        return this.children.map((child, i) =>
            child instanceof DoseObject
                ? child.getVolumeValue(position.clone())
                : { data: -1, state: undefined }
        );
    }
}

export { DoseGroup };
