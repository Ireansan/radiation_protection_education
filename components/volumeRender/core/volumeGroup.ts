import * as THREE from "three";

import { VolumeObject } from "./VolumeObject";

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
export class VolumeGroup extends THREE.Group {
    _clim1: number;
    _clim2: number;
    _colormap: string;
    _renderstyle: string;
    _isothreshold: number;
    _clipping: boolean;
    _clippingPlanes: THREE.Plane[];

    volumeParamAutoUpdate: boolean;

    // isGroup: boolean;

    constructor() {
        super();

        this._clim1 = 0;
        this._clim2 = 1;
        this._colormap = "viridis";
        this._renderstyle = "mip";
        this._isothreshold = 0.1;
        this._clipping = false;
        this._clippingPlanes = [];

        this.volumeParamAutoUpdate = true;

        // this.isGroup = true;
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
        renderstyle === "mip" ? 0 : 1;
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
        this.updateVolumeParam(false, true);
    }
    get clippingPlanes() {
        return this._clippingPlanes;
    }
    set clippingPlanes(planes: THREE.Plane[]) {
        this._clippingPlanes = planes;
        this.updateVolumeParam(false, true);
        console.log("group", planes)
    }

    // https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L601
    updateVolumeParam(updateParents: boolean, updateChildren: boolean) {
        // update parent
        const parent = this.parent;
        if (updateParents === true) {
            if (
                parent !== null &&
                parent instanceof VolumeObject &&
                parent.volumeParamAutoUpdate === true
            ) {
                parent.updateVolumeParam(true, false);
            }
        }

        if (parent !== null && parent instanceof VolumeObject) {
            this._clim1 = parent._clim1;
            this._clim2 = parent._clim2;
            this._colormap = parent._colormap;
            this._renderstyle = parent._renderstyle;
            this._isothreshold = parent._isothreshold;
            this._clipping = parent._clipping;
            this._clippingPlanes = parent._clippingPlanes;
        }

        // update children
        if (updateChildren === true) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (
                    child instanceof VolumeObject &&
                    child.volumeParamAutoUpdate === true
                ) {
                    child.updateVolumeParam(false, true);
                }
            }
        }
    }
}
