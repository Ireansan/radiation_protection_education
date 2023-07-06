import * as THREE from "three";
import { Volume } from "three-stdlib";

import { VolumeObject } from "./volumeObject";

class DoseObject extends VolumeObject {
    constructor(
        volume = new Volume(),
        coefficient = 1.0,
        offset = 0.0,
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
        super(
            volume,
            coefficient,
            offset,
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

    getVolumeValue(position: THREE.Vector3): number {
        let boards = this.clippingPlanesObjects.filter(
            (element) => element.isType === "board"
        );

        // if clipped, retrun NaN
        let planes;
        let plane;
        let clipped = boards.length > 0 ? true : false;
        for (let i = 0; i < boards.length; i++) {
            planes = boards[i].planes;

            for (let j = 0; j < planes.length; j++) {
                plane = planes[j];

                clipped =
                    clipped && position.dot(plane.normal) > plane.constant;
            }
        }
        if (clipped) {
            return NaN;
        }

        return super.getVolumeValue(position);
    }
}

export { DoseObject };
