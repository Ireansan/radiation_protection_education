import React, { useEffect, useRef } from "react";
import { extend, useThree, useLoader } from "@react-three/fiber";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";
// import { NRRDLoader } from "three-stdlib";

import { VolumeObject } from "../../../src"; // FIXME: filepath
extend({ VolumeObject });

import { Volume } from "three-stdlib";

import { applyBasePath } from "../../utils"; // FIXME: filepath
const modelURL = applyBasePath(`/models/nrrd/model.nrrd`);

export function Model({ ...props }: JSX.IntrinsicElements["volumeObject"]) {
    const { gl } = useThree();
    gl.localClippingEnabled = true;

    const volume: Volume = useLoader(NRRDLoader, modelURL);

    return (
        <>
            <volumeObject args={[volume]} {...props} />
        </>
    );
}
