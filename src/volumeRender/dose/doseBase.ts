import * as THREE from "three";

import { VolumeBase } from "../core";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 * @link https://github.com/mrdoob/three.js/blob/master/src/objects/Mesh.js
 *
 * @abstract Volume Base
 */
class DoseBase extends VolumeBase {
    _boardCoefficient: number;
    _boardOffset: number;

    _clippingPlanesIsBoard: boolean[];

    constructor() {
        super();

        this._boardCoefficient = 1.0;
        this._boardOffset = 0.0;

        this._clippingPlanesIsBoard = [];
    }

    get boardCoefficient() {
        return this._boardCoefficient;
    }
    set boardCoefficient(coefficient: number) {
        this._boardCoefficient = coefficient;
        this.updateStaticParam(false, true);
    }
    get boardOffset() {
        return this._boardOffset;
    }
    set boardOffset(offset: number) {
        this._boardOffset = offset;
        this.updateStaticParam(false, true);
    }

    updateStaticParam(updateParents: boolean, updateChildren: boolean) {
        // ----------
        // update parent, this, and children
        // ----------
        super.updateStaticParam(updateParents, updateChildren);

        // ----------
        // update this by parent
        // ----------
        const parent = this.parent;
        if (parent !== null && this.staticParamAutoUpdate) {
            if (parent instanceof DoseBase) {
                this._boardCoefficient = parent._boardCoefficient;
                this._boardOffset = parent._boardOffset;
            }
        }
    }

    updateVolumeClipping(updateParents: boolean, updateChildren: boolean) {
        // ----------
        // update parent, this, and children
        // ----------
        super.updateVolumeClipping(updateParents, updateChildren);

        // ----------
        // reset this isBoard values
        // ----------
        this._clippingPlanesIsBoard = [];

        // ----------
        // update this isBoard
        // ----------
        let isBoardArray = new Array(this.planesLength).fill(false);
        this._clippingPlanesIsBoard =
            this._clippingPlanesIsBoard.concat(isBoardArray);

        for (let i = 0; i < this.totalClippingPlanesObjects.length; i++) {
            let element = this.totalClippingPlanesObjects[i];

            this._clippingPlanesIsBoard[i] = element.isType === "board";
        }
    }
}

export { DoseBase };
