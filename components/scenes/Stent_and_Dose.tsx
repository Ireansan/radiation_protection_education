import React, { useEffect, useRef, forwardRef } from "react";

import { Canvas, extend, ReactThreeFiber } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import {
    VolumeAnimationObject,
    VolumeGroup,
    VolumeAnimationControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../volumeRender";
extend({ VolumeGroup });

import { VolumeCompareControls } from "../volumeRender/VolumeCompareControls";

import * as MODELS from "../models";

function StentAndDose() {
    const ref = useRef<VolumeGroup>(null!);
    const refStent = useRef<VolumeGroup>(null);
    const refDose = useRef<VolumeGroup>(null);
    const refDoseAnimation = useRef<VolumeAnimationObject>(null);

    useEffect(() => {
        console.log(ref.current);
    }, [ref]);

    return (
        <>
            <Canvas camera={{ position: [32, 64, 32] }}>
                {/* ================================================== */}
                {/* Volume Objects */}
                <volumeGroup ref={ref}>
                    {/* Stent */}
                    <volumeGroup
                        ref={refStent}
                        position={[70, 0, 0]}
                        volumeParamAutoUpdate={false}
                    >
                        <MODELS.Stent rotation={[-Math.PI / 2, 0, 0]} />
                    </volumeGroup>

                    {/* Dose */}
                    <volumeGroup
                        ref={refDose}
                        position={[-100, 50, -100]}
                        scale={2}
                        volumeParamAutoUpdate={false}
                    >
                        <volumeAnimationObject
                            ref={refDoseAnimation}
                            position={[45, 0, 48]}
                            rotation={[0, Math.PI, -Math.PI / 2]}
                        >
                            <MODELS.Dose_nocurtain_all_Animation />
                        </volumeAnimationObject>
                    </volumeGroup>
                </volumeGroup>

                {/* ================================================== */}
                {/* Three.js Objects */}
                <group
                    position={[-70, 50, -100]}
                    rotation={[0, 0, Math.PI]}
                    scale={1 / 2}
                >
                    <MODELS.Dose_material />
                    <MODELS.Dose_region />
                </group>

                {/* ================================================== */}
                {/* Contorls */}
                <VolumeAnimationControls
                    objects={[refDoseAnimation]}
                    duration={16}
                />
                <VolumeParameterControls
                    object={refStent}
                    folderName="Stent Param"
                />
                <VolumeParameterControls
                    object={refDose}
                    folderName="Dose Param"
                />
                <VolumeClippingControls
                    object={ref}
                    folderName="Clipping"
                    normals={[
                        [0, 0, -1],
                        // [-1, 0, 0],
                    ]}
                    planeSize={100}
                    subPlaneSize={50}
                />

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

export default StentAndDose;
