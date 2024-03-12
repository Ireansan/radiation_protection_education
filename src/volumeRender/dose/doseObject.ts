import { Volume } from "three-stdlib";

import { VolumeObject } from "../core";

class DoseObject extends VolumeObject {
    // ==================================================
    // Constructor
    constructor(
        volume = new Volume(),
        isPerspective = false,
        coefficient = 1.0,
        offset = 0.0,
        boardCoefficient = 0.01,
        boardOffset = 0.0,
        opacity = 1.0,
        clim1 = 0,
        clim2 = 1,
        colormap = "viridis",
        renderstyle = "mip",
        isothreshold = 0.1,
        clipping = false,
        clippingPlanes = [],
        clipIntersection = false
    ) {
        // Init
        super(
            volume,
            true,
            isPerspective,
            coefficient,
            offset,
            boardCoefficient,
            boardOffset,
            opacity,
            clim1,
            clim2,
            colormap,
            renderstyle,
            isothreshold,
            clipping,
            clippingPlanes,
            clipIntersection
        );
    }
}

export { DoseObject };
