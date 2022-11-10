import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";
import getConfig from "next/config";

import { modelProps } from "../types";
import { Object } from "../../volumeRender";

const { publicRuntimeConfig } = getConfig();
const basePath = (publicRuntimeConfig && publicRuntimeConfig.basePath) || "";
const modelURL = `${basePath}/models/nrrd/dose_animation/dose_15.nrrd`;

export function Dose_15({
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
