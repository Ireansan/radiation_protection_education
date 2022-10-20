import * as THREE from "three";

import { VolumeRenderObject } from "./index";
import { volumeStore, clippingPlaneStore } from "../stores";
import { useEffect, useRef } from "react";

type volumeRenderDataProps = {
    volume: any;
    position?: number[];
    rotation?: number[];
    scale?: number[];
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
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    clipping = false,
    ...props
}: volumeRenderDataProps) {
    const [clim1, clim2, cmtextures, colormap, renderstyle, isothreshold] =
        volumeStore((state) => [
            state.clim1,
            state.clim2,
            state.cmtextures,
            state.colormap,
            state.renderstyle,
            state.isothreshold,
        ]);
    const plane = clippingPlaneStore((state) => state.plane);
    const position_ = new THREE.Vector3(position[0], position[1], position[2]);
    const rotation_ = new THREE.Euler(rotation[0], rotation[1], rotation[2]);
    const scale_ = new THREE.Vector3(scale[0], scale[1], scale[2]);

    return (
        <>
            <VolumeRenderObject
                volume={volume}
                position={position_}
                rotation={rotation_}
                scale={scale_}
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
