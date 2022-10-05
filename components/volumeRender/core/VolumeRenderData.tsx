import * as THREE from "three";

import { VolumeRenderObject } from "./index";
import { volumeStore, clippingPlaneStore } from "../states";

/**
 * @function VolumeFileObject
 * @param volume any
 * @param position THREE.Vector3, Default (0, 0, 0)
 * @param rotation THREE.Euler, Default (0, 0, 0)
 * @param scale THREE.Vector3, Default (1, 1, 1)
 */
type volumeRenderDataArg = {
    volume: any;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
};
function VolumeRenderData({
    volume,
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    ...props
}: volumeRenderDataArg) {
    const { clim1, clim2, cmtextures, colormap, renderstyle, isothreshold } =
        volumeStore();
    const plane: THREE.Plane = clippingPlaneStore((state) => state.plane);

    return (
        <>
            <VolumeRenderObject
                volume={volume}
                position={position}
                rotation={rotation}
                scale={scale}
                cmtextures={cmtextures}
                clim1={clim1}
                clim2={clim2}
                colormap={colormap}
                renderstyle={renderstyle}
                isothreshold={isothreshold}
                plane={plane}
                {...props}
            />
        </>
    );
}
