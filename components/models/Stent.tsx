import React, { useEffect, useRef } from "react";
import { extend, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { NRRDLoader } from "three/examples/jsm/loaders/NRRDLoader";
// import { NRRDLoader } from "three-stdlib";

import { useNRRD } from "../volumeRender/core/useNRRD";

import { modelProps } from "./types";
import { VolumeObject } from "../volumeRender/core/VolumeObject";
extend({ VolumeObject });

import { Volume } from "three-stdlib";

import { applyBasePath } from "../utils";
const modelURL = applyBasePath(`/models/nrrd/stent.nrrd`);

export function Stent({ ...props }: JSX.IntrinsicElements["volumeObject"]) {
    const volume: Volume = useLoader(NRRDLoader, modelURL);
    // const volume: Volume = useNRRD(modelURL);

    console.log("stent", volume);
    const refTest = useRef<VolumeObject>(null);

    useEffect(() => {
        if (refTest.current) {
            refTest.current.renderstyle = props.renderstyle ?? "mip";
        }
    }, [props]);

    return (
        <>
            {console.log("rendering", volume, props)}
            <volumeObject ref={refTest} args={[volume]} {...props} />
        </>
    );
}

// useLoader.preload(NRRDLoader, modelURL);
