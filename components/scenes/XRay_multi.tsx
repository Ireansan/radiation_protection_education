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

function XRayMulti() {
    // FIXME:
    const ref = useRef<VolumeGroup>(null!);
    const refCurtain = useRef<VolumeGroup>(null);
    const refCurtainAnimation = useRef<VolumeAnimationObject>(null);
    const refNocurtain = useRef<VolumeGroup>(null);
    const refNocurtainAnimation = useRef<VolumeAnimationObject>(null);

    useEffect(() => {
        console.log(ref.current);
    }, [ref]);

    return (
        <>
            <Canvas camera={{ position: [32, 64, 32] }}>
                {/* Volume Objects */}
                <volumeGroup ref={ref}>
                    {/* Curtain */}
                    <volumeGroup ref={refCurtain} position={[50, 0, 0]}>
                        <volumeAnimationObject
                            ref={refCurtainAnimation}
                            position={[45, 0, 48]}
                            rotation={[0, Math.PI, -Math.PI / 2]}
                        >
                            <MODELS.Dose_curtain_all_Animation />
                        </volumeAnimationObject>
                    </volumeGroup>
                    {/* Nocurtain */}
                    <volumeGroup ref={refNocurtain} position={[-50, 0, 0]}>
                        <volumeAnimationObject
                            ref={refNocurtainAnimation}
                            position={[45, 0, 48]}
                            rotation={[0, Math.PI, -Math.PI / 2]}
                        >
                            <MODELS.Dose_nocurtain_all_Animation />
                        </volumeAnimationObject>
                    </volumeGroup>
                </volumeGroup>

                {/* Three.js Objects */}
                <group
                    position={[50, 0, 0]}
                    rotation={[0, 0, Math.PI]}
                    scale={1 / 4}
                >
                    <MODELS.Dose_material />
                    <MODELS.Dose_region />
                </group>
                <group
                    position={[-50, 0, 0]}
                    rotation={[0, 0, Math.PI]}
                    scale={1 / 4}
                >
                    <MODELS.Dose_material />
                    <MODELS.Dose_region />
                </group>

                {/* Contorls */}
                <VolumeAnimationControls
                    objects={[refCurtainAnimation, refNocurtainAnimation]}
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

export default XRayMulti;
