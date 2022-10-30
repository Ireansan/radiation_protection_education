import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";

import { modelProps } from "../types";
import { Object } from "../../volumeRender";

export function Dose_2({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    clipping = false,
    ...props
}: modelProps) {
    const volume: any = useLoader(
        NRRDLoader,
        "/models/nrrd/dose_animation/dose_2.nrrd"
    );

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
