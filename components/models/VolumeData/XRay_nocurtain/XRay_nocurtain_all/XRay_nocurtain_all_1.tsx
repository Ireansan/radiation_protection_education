import React from "react";
import {
    extend,
    ReactThreeFiber,
    useThree,
    useLoader,
} from "@react-three/fiber";
import * as THREE from "three";
import { Volume, NRRDLoader } from "three-stdlib";

import { DoseObject } from "../../../../../src";
import { applyBasePath } from "../../../../../utils";
const modelURL = applyBasePath(
    `/models/nrrd/x-ray/nocurtain_animation/x-ray_nocurtain_1.nrrd`,
);

export function XRay_nocurtain_all_1({
    ...props
}: JSX.IntrinsicElements["doseObject"]) {
    const { gl, camera, size } = useThree();
    gl.localClippingEnabled = true;
    const isPerspective = React.useMemo(
        () => camera instanceof THREE.PerspectiveCamera,
        [camera],
    );

    // @ts-ignore
    const volume: Volume = useLoader(NRRDLoader, modelURL);

    const ref = React.useRef<DoseObject>(null);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.resolution = new THREE.Vector2(size.width, size.height);
        }
    }, [size]);

    return (
        <>
            <doseObject ref={ref} args={[volume, isPerspective]} {...props} />
        </>
    );
}
