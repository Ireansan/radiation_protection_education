import * as THREE from "three";

import { VolumeGroup } from "../core";
import type { DoseValue } from "./doseBase";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 *
 * @abstract Volume Group
 */
class DoseGroup extends VolumeGroup {
    constructor() {
        super(true);
    }
}

export { DoseGroup };
