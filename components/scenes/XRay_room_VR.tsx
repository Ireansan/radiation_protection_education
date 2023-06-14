import React, { useRef } from "react";

import { Canvas, extend } from "@react-three/fiber";
import { VRButton, XR, Interactive, Controllers } from "@react-three/xr";
import { Stats } from "@react-three/drei";
import * as THREE from "three";

import { VolumeGroup, VolumeAnimationObject } from "../../src";
import {
    VolumeAnimationControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../volumeRender";

import * as VOLUMEDATA from "../models/VolumeData";
import * as SCENES from "./index";

function XRayRoomVR() {
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<VolumeAnimationObject>(null);

    return (
        <>
            <VRButton />
            <Canvas>
                <ambientLight intensity={0.5} />

                <XR>
                    {/* Volume Objects */}
                    <volumeGroup ref={ref}>
                        <volumeAnimationObject
                            ref={refAnimation}
                            position={[45, 0, 48]}
                            rotation={[0, Math.PI, -Math.PI / 2]}
                        >
                            <VOLUMEDATA.Dose_all_Animation />
                        </volumeAnimationObject>
                    </volumeGroup>

                    {/* Three.js Objects */}
                    <group rotation={[0, 0, Math.PI]} scale={1 / 4}>
                        <VOLUMEDATA.Dose_material />
                        <VOLUMEDATA.Dose_region />
                    </group>

                    {/* Contorls */}
                    <VolumeAnimationControls
                        objects={[refAnimation]}
                        duration={16}
                    />
                    <VolumeParameterControls object={ref} />
                    <VolumeClippingControls
                        object={ref}
                        folderName="Dose"
                        normals={[
                            [0, 0, -1],
                            // [-1, 0, 0],
                        ]}
                        planeSize={100}
                        subPlaneSize={50}
                    />
                </XR>
            </Canvas>

            <Stats />
        </>
    );
}

export default XRayRoomVR;
