import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";

import { modelProperties } from "./types";
import { VolumeRenderData } from "../volumeRender";

function Dose_106_200_290({
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    clipping = false,
    ...props
}: modelProperties) {
    const volume: any = useLoader(
        NRRDLoader,
        "/models/nrrd/dose_106_200_290.nrrd"
    );

    return (
        <>
            <VolumeRenderData
                volume={volume}
                position={position}
                rotation={rotation}
                scale={scale}
                clipping={clipping}
                {...props}
            />
        </>
    );
}

export default Dose_106_200_290;
