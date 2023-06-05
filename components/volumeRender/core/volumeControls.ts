import * as THREE from "three";
import { VolumeBase } from "./volumeBase";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/TransformControls.js
 */
class VolumeControls extends VolumeBase {
    object: VolumeBase | undefined;

    regionId: number | undefined;

    isVolumeControls: boolean;

    constructor() {
        super();

        this.object = undefined;
        this.visible = false;

        this.isVolumeControls = true;
    }

    set clim1(clim1: number) {
        this._clim1 = clim1;
        this.updateVolumeParam();
    }
    set clim2(clim2: number) {
        this._clim2 = clim2;
        this.updateVolumeParam();
    }

    set colormap(colormap: string) {
        this._colormap = colormap;
        this.updateVolumeParam();
    }

    set renderstyle(renderstyle: string) {
        this._renderstyle = renderstyle;
        this.updateVolumeParam();
    }

    set isothreshold(isothreshold: number) {
        this._isothreshold = isothreshold;
        this.updateVolumeParam();
    }

    set clipping(clipping: boolean) {
        this._clipping = clipping;
        this.updateVolumeClipping();
    }
    set clippingPlanes(planes: THREE.Plane[]) {
        this._clippingPlanes = planes;
        this.updateVolumeClipping();
    }
    set clipIntersection(clipIntersection: boolean) {
        this._clipIntersection = clipIntersection;
        this.updateVolumeClipping();
    }

    updateVolumeParam() {
        // update attached object
        if (this.object && this.object instanceof VolumeBase) {
            this.object.clim1 = this._clim1;
            this.object.clim2 = this._clim2;
            this.object.colormap = this._colormap;
            this.object.renderstyle = this._renderstyle;
            this.object.isothreshold = this._isothreshold;
        }
    }

    updateVolumeClipping() {
        // update attached object
        if (this.object && this.object instanceof VolumeBase) {
            if (this.regionId === undefined) {
                this.regionId = this.object.clippingPlanesObjects.length;
                this.object.push(this._clippingPlanes, this._clipping, this._clipIntersection);
            } else {
                this.object.setClippingPlanesObjects(
                    this.regionId,
                    this._clipping,
                    this._clippingPlanes,
                    this._clipIntersection
                );
            }
        }
    }

    // Set current object
    attach(object: VolumeBase) {
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

export { VolumeControls };
