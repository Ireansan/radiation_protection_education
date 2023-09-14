import * as THREE from "three";
import { ClippingPlanesObject } from "../core";
import { DoseBase } from "./doseBase";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/TransformControls.js
 */
class DoseControls extends DoseBase {
    object: DoseBase | undefined;

    _invert: boolean;
    _isType?: string;

    regionId: number | undefined;

    isDoseControls: boolean;

    constructor() {
        super();

        this.object = undefined;
        this.visible = false;

        this._invert = false;

        this.isDoseControls = true;
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
        if (this.object && this.object instanceof DoseBase) {
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
        if (this.object && this.object instanceof DoseBase) {
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

            this.object.boardEffect = this._boardEffect;
        }
    }

    // Set current object
    attach(object: DoseBase) {
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

export { DoseControls };
