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
    // ==================================================
    // Constructor
    constructor(isPerspective = false) {
        super(true, isPerspective);
    }
}

export { DoseBase };
