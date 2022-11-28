import React from "react";
import {
    extend,
    ReactThreeFiber,
    useThree,
    useLoader,
} from "@react-three/fiber";
import { Volume, NRRDLoader } from "three-stdlib";

import { VolumeObject } from "../../../volumeRender"; // FIXME: filepath
extend({ VolumeObject });
declare module "@react-three/fiber" {
    interface ThreeElements {
        volumeObject: ReactThreeFiber.Object3DNode<
            VolumeObject,
            typeof VolumeObject
        >;
    }
}
import { applyBasePath } from "../../../utils";
const modelURL = applyBasePath(`/models/nrrd/dose_animation/dose_12.nrrd`);

export function Dose_all_12({
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
