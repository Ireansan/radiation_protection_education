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
        let boards = this.totalClippingPlanesObjects.filter(
            (element) => element.isType === "board"
        );

        const XOR = (a: boolean, b: boolean) => {
            return (a || b) && !(a && b);
        };

        // if clipped, retrun NaN
        let planes: THREE.Plane[];
        let board;
        let clipped = false;
        for (let i = 0; i < boards.length; i++) {
            board = boards[i];
            planes = board.planes;

            let plane: THREE.Plane;
            let tmpClipped = true;
            for (let j = 0; j < planes.length; j++) {
                plane = planes[j];

                let normal = plane.normal.clone().multiplyScalar(-1);

                tmpClipped =
                    tmpClipped && position.dot(normal) > plane.constant;
            }
            tmpClipped = XOR(tmpClipped, board.invert);

            clipped = clipped || tmpClipped;
        }

        if (clipped) {
            return -1; // NaN
        }

        return super.getVolumeValue(position);
    }
}

export { DoseObject };
