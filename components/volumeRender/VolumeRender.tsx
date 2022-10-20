import React, { useEffect } from "react";
import { useSnapshot } from "valtio";
import * as THREE from "three";

import { VolumeRenderObject } from "./core";
import { volumeStore, clippingPlaneStore } from "./stores";

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
    const [
        setPosition,
        setRotation,
        setScale,
        clim1,
        clim2,
        colormap,
        renderstyle,
        isothreshold,
    ] = volumeStore((state) => [
        state.setPosition,
        state.setRotation,
        state.setScale,
        state.clim1,
        state.clim2,
        state.colormap,
        state.renderstyle,
        state.isothreshold,
    ]);

    const plane: THREE.Plane = clippingPlaneStore((state) => state.plane);

    // Init
    useEffect(() => {
        setPosition(position);
        setRotation(rotation);
        setScale(scale);
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
