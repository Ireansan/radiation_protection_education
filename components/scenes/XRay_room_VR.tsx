import React, { useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import { VRButton, XR, Interactive, Controllers } from "@react-three/xr";
import { Stats } from "@react-three/drei";
import * as THREE from "three";

import { VolumeControls, ClippingPlaneControls } from "../volumeRender";
import * as MODELS from "../models";
import * as SCENES from "./index";

function XRayRoomVR() {
    const h = 256; // frustum height
    const camera = new THREE.OrthographicCamera();

    // Init
    useEffect(() => {
        // Setup Camera
        const aspect = window.innerWidth / window.innerHeight;
        camera.copy(
            new THREE.OrthographicCamera(
                (-h * aspect) / 2,
                (h * aspect) / 2,
                h / 2,
                -h / 2,
                0.001,
                1000
            )
        );
    }, []);

    return (
        <>
            <VRButton />
            <Canvas camera={camera}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <ambientLight intensity={0.5} />

                <XR>
                    <group>
                        <VolumeControls>
                            <ClippingPlaneControls>
                                <SCENES.XRayRoomAnimation
                                    position={[45, 0, 48]}
                                    rotation={[0, Math.PI, -Math.PI / 2]}
                                />
                            </ClippingPlaneControls>
                        </VolumeControls>
                        {/* eslint-disable-next-line react/no-unknown-property */}
                        <group rotation={[0, 0, Math.PI]} scale={1 / 6}>
                            <MODELS.Dose_material />
                            <MODELS.Dose_region />
                        </group>
                    </group>
                </XR>
            </Canvas>

            <Stats />
        </>
    );
}

export default XRayRoomVR;
