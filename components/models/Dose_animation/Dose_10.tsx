import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";

import { modelProps } from "../types";
import { Object } from "../../volumeRender";

const modelURL = `/models/nrrd/dose_animation/dose_10.nrrd`;

export function Dose_10({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    clipping = false,
    ...props
}: modelProps) {
    const volume: any = useLoader(NRRDLoader, modelURL);

    return (
        <>
            <Object
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
