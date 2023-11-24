import React from "react";
import {
    extend,
    ReactThreeFiber,
    useThree,
    useLoader,
} from "@react-three/fiber";
import * as THREE from "three";
import { Volume, NRRDLoader } from "three-stdlib";

import { applyBasePath } from "../../../../../utils";
const modelURL = applyBasePath(
    `/models/nrrd/c-arm/animation/c-arm_2.nrrd`
);

export function CArm_all_2({
    ...props
}: JSX.IntrinsicElements["doseObject"]) {
    const { gl, camera } = useThree();
    gl.localClippingEnabled = true;
    const isPerspective = React.useMemo(
        () => camera instanceof THREE.PerspectiveCamera,
        [camera]
    );

    // @ts-ignore
    const volume: Volume = useLoader(NRRDLoader, modelURL);

    return (
        <>
            <doseObject args={[volume, isPerspective]} {...props} />
        </>
    );
}
