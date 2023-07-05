import React, { useEffect, useRef } from "react";
import {
    extend,
    ReactThreeFiber,
    useThree,
    useLoader,
    useFrame,
} from "@react-three/fiber";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";
// import { NRRDLoader } from "three-stdlib";

import { VolumeObject } from "../../../src";
extend({ VolumeObject });

import { Volume } from "three-stdlib";

import { applyBasePath } from "../../utils";
const modelURL = applyBasePath(`/models/nrrd/stent.nrrd`);

export function Stent({ ...props }: JSX.IntrinsicElements["volumeObject"]) {
    const ref = useRef<VolumeObject>(null!);

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

export const Stent_Configure = {
    volume: {
        rotation: [-Math.PI / 2, 0, 0] as THREE.Vector3Tuple,
        scale: 1 / 128,
    },
};
