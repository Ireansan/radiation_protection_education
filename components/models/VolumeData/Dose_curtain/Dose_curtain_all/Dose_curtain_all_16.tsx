import React from "react";
import {
    extend,
    ReactThreeFiber,
    useThree,
    useLoader,
} from "@react-three/fiber";
import { Volume, NRRDLoader } from "three-stdlib";

import { VolumeObject } from "../../../../../src"; // FIXME: filepath
extend({ VolumeObject });

import { applyBasePath } from "../../../../utils";
const modelURL = applyBasePath(
    `/models/nrrd/dose_curtain_animation/dose_curtain_16.nrrd`
);

export function Dose_curtain_all_16({
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
