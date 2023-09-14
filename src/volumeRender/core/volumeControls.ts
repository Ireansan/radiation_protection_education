import * as THREE from "three";
import { ClippingPlanesObject, VolumeBase } from "./volumeBase";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/TransformControls.js
 */
class VolumeControls extends VolumeBase {
    object: VolumeBase | undefined;

    _invert: boolean;
    _isType?: string;

    regionId: number | undefined;

    isVolumeControls: boolean;

    constructor() {
        super();

        this.object = undefined;
        this.visible = false;

        this._invert = false;

        this.isVolumeControls = true;
    }

    get invert() {
        return this._invert;
    }
    set invert(invert: boolean) {
        this._invert = invert;
        this._clippingPlanesObject
            ? (this._clippingPlanesObject.invert = invert)
            : null;
        this.updateVolumeClipping();
    }
    get isType() {
        return this._isType;
    }
    set isType(type: string | undefined) {
        this._isType = type;
        this._clippingPlanesObject
            ? (this._clippingPlanesObject.isType = type)
            : null;
        this.updateVolumeClipping();
    }

    updateVolumeParam() {
        // update attached object
        if (this.object && this.object instanceof VolumeBase) {
            this.object.opacity = this._opacity;
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

                this._clippingPlanesObject = new ClippingPlanesObject(
                    NaN,
                    this._clippingPlanes,
                    this._clipping,
                    this._clipIntersection,
                    this._invert,
                    this._isType
                );

                this.object.pushClippingPlanesObjects(
                    this._clippingPlanesObject
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
