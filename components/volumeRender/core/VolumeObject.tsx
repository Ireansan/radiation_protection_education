import React, { useState } from "react";

import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";

import VolumeRenderObject from "./VolumeRenderObject";

/**
 * VolumeObject
 * @param filepath: string
 * @param position?: THREE.Vector3, Default (0, 0, 0)
 * @param rotation?: THREE.Euler, Default (0, 0, 0)
 * @param scale?: THREE.Vector3, Default (1, 1, 1)
 * @param cmtextures: THREE.Texture[]
 * @param clim1: number
 * @param clim2: number
 * @param colormap: number
 * @param renderstyle: string
 * @param isothreshold: number
 * @param plane?: THREE.Plane
 */
type volumeObjArg = {
    filepath: string;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
    cmtextures: THREE.Texture[];
    clim1?: number;
    clim2?: number;
    colormap: number;
    renderstyle: string;
    isothreshold: number;
    plane?: THREE.Plane;
};
function VolumeObject({
    filepath,
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    cmtextures,
    clim1 = 0,
    clim2 = 1,
    colormap,
    renderstyle,
    isothreshold,
    plane,
    ...props
}: volumeObjArg) {
    const [volume, setVolume] = useState<any>(useLoader(NRRDLoader, filepath));

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

export default VolumeObject;
