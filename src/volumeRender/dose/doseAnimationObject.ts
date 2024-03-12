import { VolumeAnimationObject } from "../core";

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
class DoseAnimationObject extends VolumeAnimationObject {
    // ==================================================
    // Constructor
    constructor() {
        super(true);
    }
}

export { DoseAnimationObject };
