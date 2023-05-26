import * as THREE from "three";

import { VolumeObject } from "./volumeObject";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 *
 * @abstract Core
 * @param volume any
 * @param clim1 number, Default 0
 * @param clim2 number, Default 1
 * @param colormap string, Default viridis
 * @param renderstyle string, Default mip
 * @param isothreshold number, Default 0.1
 * @param clipping boolean, Default false
 * @param planes THREE.Plane
 */
class VolumeGroup extends THREE.Group {
    _clim1: number;
    _clim2: number;
    _colormap: string;
    _renderstyle: string;
    _isothreshold: number;
    _clipping: boolean;
    _clippingPlanes: THREE.Plane[];
    _clipIntersection: boolean;

    volumeParamAutoUpdate: boolean;
    volumeClippingAutoUpdate: boolean;

    volumeParamWorldAutoUpdate: boolean;
    volumeClippingWorldAutoUpdate: boolean;

    constructor() {
        super();

        this._clim1 = 0;
        this._clim2 = 1;
        this._colormap = "viridis";
        this._renderstyle = "mip";
        this._isothreshold = 0.1;
        this._clipping = false;
        this._clippingPlanes = [];
        this._clipIntersection = false;

        this.volumeParamAutoUpdate = true;
        this.volumeClippingAutoUpdate = true;

        this.volumeParamWorldAutoUpdate = true;
        this.volumeClippingWorldAutoUpdate = true;

        this.type = "Group";
    }

    get clim1() {
        return this._clim1;
    }
    set clim1(clim1: number) {
        this._clim1 = clim1;
        this.updateVolumeParam(false, true);
    }
    get clim2() {
        return this._clim2;
    }
    set clim2(clim2: number) {
        this._clim2 = clim2;
        this.updateVolumeParam(false, true);
    }

    get colormap() {
        return this._colormap;
    }
    set colormap(colormap: string) {
        this._colormap = colormap;
        this.updateVolumeParam(false, true);
    }

    get renderstyle() {
        return this._renderstyle;
    }
    set renderstyle(renderstyle: string) {
        this._renderstyle = renderstyle;
        this.updateVolumeParam(false, true);
    }

    get isothreshold() {
        return this._isothreshold;
    }
    set isothreshold(isothreshold: number) {
        this._isothreshold = isothreshold;
        this.updateVolumeParam(false, true);
    }

    get clipping() {
        return this._clipping;
    }
    set clipping(clipping: boolean) {
        this._clipping = clipping;
        this.updateVolumeClipping(false, true);
    }
    get clippingPlanes() {
        return this._clippingPlanes;
    }
    set clippingPlanes(planes: THREE.Plane[]) {
        this._clippingPlanes = planes;
        this.updateVolumeClipping(false, true);
    }
    get clipIntersection() {
        return this._clipIntersection;
    }
    set clipIntersection(clipIntersection: boolean) {
        this._clipIntersection = clipIntersection;
        this.updateVolumeClipping(false, true);
    }

    // https://github.com/mrdoob/three.js/blob/47b28bc564b438bf2b80d6e5baf90235292fcbd7/src/core/Object3D.js#L627
    updateVolumeParam(updateParents: boolean, updateChildren: boolean) {
        // update parent
        const parent = this.parent;
        if (
            updateParents === true &&
            parent !== null &&
            this.volumeParamWorldAutoUpdate
        ) {
            if (
                parent instanceof VolumeObject ||
                parent instanceof VolumeGroup
            ) {
                parent.updateVolumeParam(true, false);
            }
        }

        // update this
        if (parent !== null && this.volumeParamAutoUpdate) {
            if (
                parent instanceof VolumeObject ||
                parent instanceof VolumeGroup
            ) {
                this._clim1 = parent._clim1;
                this._clim2 = parent._clim2;
                this._colormap = parent._colormap;
                this._renderstyle = parent._renderstyle;
                this._isothreshold = parent._isothreshold;
            }
        }

        // update children
        if (updateChildren === true) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (
                    (child instanceof VolumeObject ||
                        child instanceof VolumeGroup) &&
                    child.volumeParamWorldAutoUpdate === true
                ) {
                    child.updateVolumeParam(false, true);
                }
            }
        }
    }

    updateVolumeClipping(updateParents: boolean, updateChildren: boolean) {
        // update parent
        const parent = this.parent;
        if (
            updateParents === true &&
            parent !== null &&
            this.volumeClippingWorldAutoUpdate
        ) {
            if (
                parent instanceof VolumeObject ||
                parent instanceof VolumeGroup
            ) {
                parent.updateVolumeClipping(true, false);
            }
        }

        // update this
        // FIXME:
        if (parent !== null && this.volumeClippingAutoUpdate) {
            if (
                parent instanceof VolumeObject ||
                parent instanceof VolumeGroup
            ) {
                this._clipping = parent._clipping;
                this._clippingPlanes = parent._clippingPlanes;
                this._clipIntersection = parent._clipIntersection;
            }
        }

        // update children
        if (updateChildren === true) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (
                    (child instanceof VolumeObject ||
                        child instanceof VolumeGroup) &&
                    child.volumeClippingWorldAutoUpdate === true
                ) {
                    child.updateVolumeClipping(false, true);
                } else if (child instanceof THREE.Mesh) {
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
        const localPosition = this.worldToLocal(position);

        return this.children.map((child, i) =>
            child instanceof VolumeObject
                ? child.getVolumeValue(localPosition)
                : NaN
        );
    }
}

export { VolumeGroup };
