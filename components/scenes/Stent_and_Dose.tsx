import React, { useEffect, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

import { VolumeAnimationObject, VolumeGroup } from "../../src";
import {
    VolumeAnimationControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../volumeRender";

import { VolumeCompareControls } from "../volumeRender/VolumeCompareControls";

import * as VOLUMEDATA from "../models/VolumeData";

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
            {/* ================================================== */}
            {/* Three.js Canvas */}
            <Canvas orthographic camera={{ position: [4, 8, 4], zoom: 50 }}>
                {/* -------------------------------------------------- */}
                {/* Volume Object */}
                <volumeGroup ref={ref}>
                    {/* Stent */}
                    <volumeGroup
                        ref={refStent}
                        position={[2.5, 0, 0]}
                        scale={2}
                        volumeParamAutoUpdate={false}
                    >
                        <VOLUMEDATA.Stent
                            rotation={
                                VOLUMEDATA.Stent_Configure.volume.rotation
                            }
                            scale={VOLUMEDATA.Stent_Configure.volume.scale}
                        />
                    </volumeGroup>

                    {/* Dose */}
                    <volumeGroup
                        ref={refDose}
                        position={[-2.5, 0, 0]}
                        volumeParamAutoUpdate={false}
                    >
                        <volumeAnimationObject
                            ref={refDoseAnimation}
                            position={VOLUMEDATA.Dose_Configure.volume.position}
                            rotation={VOLUMEDATA.Dose_Configure.volume.rotation}
                            scale={VOLUMEDATA.Dose_Configure.volume.scale}
                        >
                            <VOLUMEDATA.Dose_nocurtain_all_Animation />
                        </volumeAnimationObject>
                    </volumeGroup>
                </volumeGroup>

                {/* -------------------------------------------------- */}
                {/* Volume Controls */}
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
                    planeSize={2}
                    subPlaneSize={1}
                />

                {/* -------------------------------------------------- */}
                {/* Three.js Objects */}
                <group position={[-2.5, 0, 0]}>
                    <group
                        position={VOLUMEDATA.Dose_Configure.object3d.position}
                        rotation={VOLUMEDATA.Dose_Configure.object3d.rotation}
                        scale={
                            VOLUMEDATA.Dose_Configure.volume.scale *
                            VOLUMEDATA.Dose_Configure.object3d.scale
                        }
                    >
                        <VOLUMEDATA.Dose_material />
                        <VOLUMEDATA.Dose_region />
                    </group>
                </group>

                {/* -------------------------------------------------- */}
                {/* Three.js Controls */}
                <OrbitControls makeDefault />

                {/* -------------------------------------------------- */}
                {/* Enviroment */}
                <ambientLight intensity={0.5} />

                {/* -------------------------------------------------- */}
                {/* UI */}
                <Stats />

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
        </>
    );
}

export default StentAndDose;
