import React, { useEffect } from "react";
import { useSnapshot } from "valtio";
import * as THREE from "three";

import { VolumeRenderObject } from "./lib/core";
import { volumeStates, clippingPlaneStore } from "./lib/states";

/**
 *
 */
type volumeRenderArg = {
    volume: any;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
    cmtextures: THREE.Texture[];
    clipping?: boolean;
};
function VolumeRender({
    volume,
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    cmtextures,
    clipping = false,
    ...props
}: volumeRenderArg) {
    const { clim1, clim2, colormap, renderstyle, isothreshold } =
        useSnapshot(volumeStates);

    const plane: THREE.Plane = clippingPlaneStore((state) => state.plane);

    // Init
    useEffect(() => {
        volumeStates.position = position;
        volumeStates.rotation = rotation;
        volumeStates.scale = scale;
    });

    return (
        <>
            <VolumeRenderObject
                position={position}
                rotation={rotation}
                scale={scale}
                volume={volume}
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

export default VolumeRender;
