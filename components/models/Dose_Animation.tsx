import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";

import { modelProperties } from "./types";
import { VolumeRenderData } from "../volumeRender";

/*
function Dose_106_200_290({
    position = new THREE.Vector3(0, 0, 0),
    rotation = new THREE.Euler(0, 0, 0),
    scale = new THREE.Vector3(1, 1, 1),
    clipping = false,
    ...props
}: modelProperties) {
    const filepaths: any[] = [
        "models/nrrd/dose_106_200_290.nrrd",
        "models/nrrd/dose_d100.nrrd",
        "models/nrrd/dose.nrrd",
        "models/nrrd/stent.nrrd",
    ];
    const volumes: any[] = [];
    for (let i = 0; i < filepaths.length; i++) {
        volumes.push(useLoader(NRRDLoader, filepaths[i]));
    }
    const volume: any = filepaths.map((fs) => {});

    const animation = new THREE.AnimationClip();
    const tracks = new THREE.KeyframeTrack(".test", [0, 1, 2]);

    return (
        <>
            <VolumeRenderData
                volume={volume}
                position={position}
                rotation={rotation}
                scale={scale}
                clipping={clipping}
            />
        </>
    );
}

export default Dose_106_200_290;
*/
