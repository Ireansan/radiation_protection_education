import * as THREE from "three";
import { VolumeObject, VolumeGroup } from "../core";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/TransformControls.js
 */
export class VolumeControls extends THREE.Object3D {
    object: VolumeObject | VolumeGroup | undefined;

    _clim1: number;
    _clim2: number;
    _colormap: string;
    _renderstyle: string;
    _isothreshold: number;
    _clipping: boolean;
    _clippingPlanes: THREE.Plane[];

    isVolumeControls: boolean;

    constructor() {
        super();

        this.object = undefined;
        this.visible = false;

        this._clim1 = 0;
        this._clim2 = 1;
        this._colormap = "viridis";
        this._renderstyle = "mip";
        this._isothreshold = 0.1;
        this._clipping = false;
        this._clippingPlanes = [];

        this.isVolumeControls = true;
    }

    get clim1() {
        return this._clim1;
    }
    set clim1(clim1: number) {
        this._clim1 = clim1;
        this.object &&
        (this.object instanceof VolumeObject ||
            this.object instanceof VolumeGroup)
            ? (this.object.clim1 = clim1)
            : null;
    }

    get clim2() {
        return this._clim2;
    }
    set clim2(clim2: number) {
        this._clim2 = clim2;
        this.object &&
        (this.object instanceof VolumeObject ||
            this.object instanceof VolumeGroup)
            ? (this.object.clim2 = clim2)
            : null;
    }

    get colormap() {
        return this._colormap;
    }
    set colormap(colormap: string) {
        this._colormap = colormap;
        this.object &&
        (this.object instanceof VolumeObject ||
            this.object instanceof VolumeGroup)
            ? (this.object.colormap = colormap)
            : null;
    }

    get renderstyle() {
        return this._renderstyle;
    }
    set renderstyle(renderstyle: string) {
        this._renderstyle = renderstyle;
        this.object &&
        (this.object instanceof VolumeObject ||
            this.object instanceof VolumeGroup)
            ? (this.object.renderstyle = renderstyle)
            : null;
    }

    get isothreshold() {
        return this._isothreshold;
    }
    set isothreshold(isothreshold: number) {
        this._isothreshold = isothreshold;
        this.object &&
        (this.object instanceof VolumeObject ||
            this.object instanceof VolumeGroup)
            ? (this.object.isothreshold = isothreshold)
            : null;
    }

    get clipping() {
        return this._clipping;
    }
    set clipping(clipping: boolean) {
        this._clipping = clipping;
        this.object &&
        (this.object instanceof VolumeObject ||
            this.object instanceof VolumeGroup)
            ? (this.object.clipping = clipping)
            : null;
    }

    get clippingPlanes() {
        return this._clippingPlanes;
    }
    set clippingPlanes(planes: THREE.Plane[]) {
        this._clippingPlanes = planes;
        this.object &&
        (this.object instanceof VolumeObject ||
            this.object instanceof VolumeGroup)
            ? (this.object.clippingPlanes = this._clipping ? planes : [])
            : null;
    }

    // Set current object
    attach(object: VolumeObject | VolumeGroup) {
        this.object = object;
        this.visible = true;

        return this;
    }

    // Detach from object
    detach() {
        this.object = undefined;
        this.visible = false;

        return this;
    }
}
