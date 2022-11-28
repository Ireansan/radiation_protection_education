import React, { useEffect, useRef } from "react";
import { extend, useThree, useLoader } from "@react-three/fiber";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";
// import { NRRDLoader } from "three-stdlib";

import { VolumeObject } from "../volumeRender/core/VolumeObject";
extend({ VolumeObject });

import { Volume } from "three-stdlib";

import { applyBasePath } from "../utils";
const modelURL = applyBasePath(`/models/nrrd/stent.nrrd`);

export function Stent({
    ref,
    ...props
}: JSX.IntrinsicElements["volumeObject"]) {
    const { gl } = useThree();
    gl.localClippingEnabled = true;

    const volume: Volume = useLoader(NRRDLoader, modelURL);

    console.log("stent", volume);
    // const refTest = useRef<VolumeObject>(null);

    return (
        <>
            {console.log("rendering", volume, props, ref)}
            <volumeObject ref={ref} args={[volume]} {...props} />
        </>
    );
}
