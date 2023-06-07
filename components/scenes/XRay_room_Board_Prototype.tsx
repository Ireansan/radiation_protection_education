import React, { useEffect, useRef } from "react";

import { Canvas, extend } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import {
    VolumeGroup,
    VolumeAnimationObject,
    VolumeAnimationControls,
    VolumeBoardControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../volumeRender";
extend({ VolumeGroup });

import * as MODELS from "../models";

function XRayRoomBoardPrototype() {
    // FIXME:
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<VolumeAnimationObject>(null);
    const refAnimation1 = useRef<VolumeAnimationObject>(null);

    useEffect(() => {
        console.log(ref.current);
        // console.log(refAnimation);
    }, [ref]);

    return (
        <>
            <Canvas camera={{ position: [32, 64, 32] }}>
                {/* Volume Objects */}
                <volumeGroup ref={ref}>
                    <volumeAnimationObject
                        ref={refAnimation}
                        position={[45, 0, 48]}
                        rotation={[0, Math.PI, -Math.PI / 2]}
                    >
                        <MODELS.Dose_all_Animation />
                    </volumeAnimationObject>
                    {/* <mesh position={[0, 0, 0]} scale={25}>
                        <sphereBufferGeometry />
                    </mesh> */}
                </volumeGroup>

                {/* Three.js Objects */}
                <group rotation={[0, 0, Math.PI]} scale={1 / 4}>
                    <MODELS.Dose_material />
                    <MODELS.Dose_region />
                </group>

                {/* Contorls */}
                <VolumeAnimationControls
                    objects={[refAnimation]}
                    duration={16}
                />
                <VolumeParameterControls object={ref} />
                {/* <VolumeClippingControls
                    object={ref}
                    folderName="Dose"
                    normals={[
                        [0, 0, -1],
                        // [1, 0, 0],
                        [-1, 0, 0],
                        // [0, 1, 0],
                        // [0, -1, 0],
                    ]}
                    planeSize={100}
                    subPlaneSize={50}
                /> */}
                <VolumeClippingControls
                    object={ref}
                    folderName="Dose 2"
                    normals={[
                        // [0, 0, -1],
                        // [1, 0, 0],
                        // [-1, 0, 0],
                        // [0, 1, 0],
                        [0, -1, 0],
                    ]}
                    planeSize={100}
                    subPlaneSize={50}
                />
                <VolumeBoardControls
                    object={ref}
                    origin={new THREE.Vector3(0, 0, 0)}
                    width={20}
                    height={50}
                    planeSize={100}
                    subPlaneSize={50}
                />

                <mesh position={[0, 0, 0]} scale={10}>
                    <sphereBufferGeometry />
                </mesh>

                <ambientLight intensity={0.5} />

                <OrbitControls makeDefault />

                <GizmoHelper
                    alignment="bottom-right"
                    margin={[80, 80]}
                    renderPriority={-1}
                >
                    <GizmoViewport
                        axisColors={["hotpink", "aquamarine", "#3498DB"]}
                        labelColor="black"
                    />
                </GizmoHelper>
            </Canvas>
            <Stats />
        </>
    );
}

export default XRayRoomBoardPrototype;
