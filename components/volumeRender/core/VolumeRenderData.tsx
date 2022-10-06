import * as THREE from "three";

import { VolumeRenderObject } from "./index";
import { volumeStore, clippingPlaneStore } from "../stores";

type volumeRenderDataArg = {
    volume: any;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
    clipping?: boolean;
};
/**
 * @function VolumeRenderData
 * @param volume any
 * @param position THREE.Vector3, Default (0, 0, 0)
 * @param rotation THREE.Euler, Default (0, 0, 0)
 * @param scale THREE.Vector3, Default (1, 1, 1)
 * @param clipping boolean, Default false
 */
function VolumeRenderData({
    volume,
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    clipping = false,
    ...props
}: volumeRenderDataArg) {
    const clim1 = volumeStore((state) => state.clim1);
    const clim2 = volumeStore((state) => state.clim2);
    const cmtextures = volumeStore((state) => state.cmtextures);
    const colormap = volumeStore((state) => state.colormap);
    const renderstyle = volumeStore((state) => state.renderstyle);
    const isothreshold = volumeStore((state) => state.isothreshold);
    const plane = clippingPlaneStore((state) => state.plane);

    return (
        <>
            <VolumeRenderObject
                volume={volume}
                position={position}
                rotation={rotation}
                scale={scale}
                clim1={clim1}
                clim2={clim2}
                cmtextures={cmtextures}
                colormap={colormap}
                renderstyle={renderstyle}
                isothreshold={isothreshold}
                clipping={clipping}
                plane={plane}
                {...props}
            />
        </>
    );
}

export default VolumeRenderData;
