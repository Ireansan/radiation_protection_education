import * as THREE from "three";

import { VolumeBase } from "../core";

export type DoseValue = {
    data: number;
    state: undefined | string[];
};

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 * @link https://github.com/mrdoob/three.js/blob/master/src/objects/Mesh.js
 *
 * @abstract Volume Base
 */
class DoseBase extends VolumeBase {
    _boardEffect: boolean;
    _boardCoefficient: number;
    _boardOffset: number;

    _clippingPlanesIsBoard: boolean[];

    boardCoefficientAutoUpdate: boolean;
    boardOffsetAutoUpdate: boolean;

    constructor(isPerspective = false) {
        super(isPerspective);

        this._boardEffect = false;
        this._boardCoefficient = 0.01;
        this._boardOffset = 0.0;

        this._clippingPlanesIsBoard = [];

        this.boardCoefficientAutoUpdate = true;
        this.boardOffsetAutoUpdate = true;
    }

    get boardEffect() {
        return this._boardEffect;
    }
    set boardEffect(boardEffect: boolean) {
        this._boardEffect = boardEffect;
        this.updateVolumeClipping(false, true);
    }
    get boardCoefficient() {
        return this._boardCoefficient;
    }
    set boardCoefficient(coefficient: number) {
        this._boardCoefficient = coefficient;
        this.updateVolumeParam(false, true);
    }
    get boardOffset() {
        return this._boardOffset;
    }
    set boardOffset(offset: number) {
        this._boardOffset = offset;
        this.updateVolumeParam(false, true);
    }

    updateVolumeParam(updateParents: boolean, updateChildren: boolean) {
        // ----------
        // update this by parent
        // ----------
        const parent = this.parent;
        if (parent !== null && this.volumeParamAutoUpdate) {
            if (parent instanceof DoseBase) {
                this.boardCoefficientAutoUpdate
                    ? (this._boardCoefficient = parent._boardCoefficient)
                    : null;
                this.boardOffsetAutoUpdate
                    ? (this._boardOffset = parent._boardOffset)
                    : null;
            }
        }

        // ----------
        // update parent, this, and children
        // ----------
        super.updateVolumeParam(updateParents, updateChildren);
    }

    updateVolumeClipping(updateParents: boolean, updateChildren: boolean) {
        // ----------
        // update parent, this, and children
        // ----------
        super.updateVolumeClipping(updateParents, updateChildren);

        // ----------
        // update this by parent
        // ----------
        const parent = this.parent;
        if (parent !== null && this.volumeClippingAutoUpdate) {
            if (parent instanceof DoseBase) {
                this._boardEffect = parent._boardEffect;
            }
        }

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

    getVolumeValue(position: THREE.Vector3): number {
        return NaN;
    }
}

export { DoseBase };
