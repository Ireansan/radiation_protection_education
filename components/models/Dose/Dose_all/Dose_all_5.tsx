import React from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";

import { modelProps } from "../../types";
import { Object } from "../../../volumeRender";

import { applyBasePath } from "../../../utils";
const modelURL = applyBasePath(`/models/nrrd/dose_animation/dose_5.nrrd`);

export function Dose_all_5({ ...props }: modelProps) {
    const volume: any = useLoader(NRRDLoader, modelURL);

    return (
        <>
            <Object volume={volume} {...props} />
        </>
    );
}
