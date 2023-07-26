import * as THREE from "three";

import { VolumeBase } from "./volumeBase";
import { VolumeObject } from "./volumeObject";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 *
 * @abstract Volume Group
 */
class VolumeGroup extends VolumeBase {
    isGroup: boolean;
    type: string;

    constructor() {
        super();

        this.isGroup = true;
        this.type = "Group";
    }

    set opacity(opacity: number) {
        this._opacity = opacity;
        this.updateVolumeParam(false, true);
    }
    set clim1(clim1: number) {
        this._clim1 = clim1;
        this.updateVolumeParam(false, true);
    }
    set clim2(clim2: number) {
        this._clim2 = clim2;
        this.updateVolumeParam(false, true);
    }

    set colormap(colormap: string) {
        this._colormap = colormap;
        this.updateVolumeParam(false, true);
    }

    set renderstyle(renderstyle: string) {
        this._renderstyle = renderstyle;
        this.updateVolumeParam(false, true);
    }

    set isothreshold(isothreshold: number) {
        this._isothreshold = isothreshold;
        this.updateVolumeParam(false, true);
    }

    set clipping(clipping: boolean) {
        this._clipping = clipping;
        this.updateVolumeClipping(false, true);
    }
    set clippingPlanes(planes: THREE.Plane[]) {
        this._clippingPlanes = planes;
        this.updateVolumeClipping(false, true);
    }
    set clipIntersection(clipIntersection: boolean) {
        this._clipIntersection = clipIntersection;
        this.updateVolumeClipping(false, true);
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
                child instanceof VolumeObject
                    ? child.getVolumeValue(position.clone())
                    : -1 // NaN
        );
    }
}

export { VolumeGroup };
