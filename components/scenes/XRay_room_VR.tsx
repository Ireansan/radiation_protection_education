import React, { useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import { VRButton, XR, Interactive, Controllers } from "@react-three/xr";
import { Stats, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

import { VolumeControls } from "../volumeRender";
import * as MODELS from "../models";
import * as SCENES from "./index";

function XRayRoomVR() {
    return (
        <>
            <VRButton />
            <Canvas>
                <ambientLight intensity={0.5} />

                <XR>
                    <VolumeControls>
                        <SCENES.Dose_all_Animation
                            position={[45, 0, 48]}
                            rotation={[0, Math.PI, -Math.PI / 2]}
                        />
                    </VolumeControls>
                    <group rotation={[0, 0, Math.PI]} scale={1 / 4}>
                        <MODELS.Dose_material />
                        <MODELS.Dose_region />
                    </group>
                </XR>
                <OrthographicCamera />
            </Canvas>

            <Stats />
        </>
    );
}

export default XRayRoomVR;
