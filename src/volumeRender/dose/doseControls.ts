import * as THREE from "three";

import { ClippingPlanesObject } from "../core";
import { VolumeControls } from "../core";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/TransformControls.js
 */
class DoseControls extends VolumeControls {
    constructor() {
        super(true);
    }
}

export { DoseControls };
