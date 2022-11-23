import React from "react";
import { extend, useThree, useLoader } from "@react-three/fiber";
import { Volume, NRRDLoader } from "three-stdlib";

import { VolumeObject } from "../../../volumeRender"; // FIXME: filepath
extend({ VolumeObject });

import { applyBasePath } from "../../../utils";
const modelURL = applyBasePath(`/models/nrrd/dose_animation/dose_16.nrrd`);

export function Dose_all_16({
    ...props
}: JSX.IntrinsicElements["volumeObject"]) {
    const { gl } = useThree();
    gl.localClippingEnabled = true;

    // @ts-ignore
    const volume: Volume = useLoader(NRRDLoader, modelURL);

    return (
        <>
            <volumeObject args={[volume]} {...props} />
        </>
    );
}
