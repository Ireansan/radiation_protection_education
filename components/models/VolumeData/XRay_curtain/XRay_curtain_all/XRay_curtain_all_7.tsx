import React from "react";
import {
    extend,
    ReactThreeFiber,
    useThree,
    useLoader,
} from "@react-three/fiber";
import { Volume, NRRDLoader } from "three-stdlib";

import { applyBasePath } from "../../../../../utils";
const modelURL = applyBasePath(
    `/models/nrrd/x-ray/curtain_animation/x-ray_curtain_7.nrrd`
);

export function XRay_curtain_all_7({
    ...props
}: JSX.IntrinsicElements["doseObject"]) {
    const { gl } = useThree();
    gl.localClippingEnabled = true;

    // @ts-ignore
    const volume: Volume = useLoader(NRRDLoader, modelURL);

    return (
        <>
            <doseObject args={[volume]} {...props} />
        </>
    );
}