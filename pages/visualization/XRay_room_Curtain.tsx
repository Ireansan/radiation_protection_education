import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    Grid,
} from "@react-three/drei";

// ==========
// Volume
// ----------
// object
import { VolumeGroup, DoseAnimationObject } from "../../src";
// ----------
// data
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    VolumeAnimationControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../../components/volumeRender";

import styles from "../../styles/threejs.module.css";

function XRayCurtain() {
    const ref = useRef<VolumeGroup>(null!);
    const refCurtain = useRef<VolumeGroup>(null);
    const refCurtainAnimation = useRef<DoseAnimationObject>(null);
    const refNocurtain = useRef<VolumeGroup>(null);
    const refNocurtainAnimation = useRef<DoseAnimationObject>(null);

    useEffect(() => {
        console.log(ref.current);
    }, [ref]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.canvas}>
                    {/* ================================================== */}
                    {/* Three.js Canvas */}
                    <Canvas
                        orthographic
                        camera={{ position: [4, 8, 4], zoom: 50 }}
                    >
                        {/* -------------------------------------------------- */}
                        {/* Volume Objects */}
                        <volumeGroup ref={ref}>
                            {/* Curtain */}
                            <volumeGroup
                                ref={refCurtain}
                                volumeClippingAutoUpdate={false}
                            >
                                <doseAnimationObject
                                    ref={refCurtainAnimation}
                                    position={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .position
                                    }
                                    rotation={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .rotation
                                    }
                                    scale={
                                        VOLUMEDATA.XRay_curtain_Configure.volume
                                            .scale
                                    }
                                    boardCoefficient={0.01}
                                >
                                    <VOLUMEDATA.XRay_curtain_all_Animation />
                                </doseAnimationObject>

                                <mesh position={[-5, 0, 0]}>
                                    <sphereBufferGeometry />
                                </mesh>
                            </volumeGroup>

                            {/* Nocurtain */}
                            <volumeGroup
                                ref={refNocurtain}
                                volumeClippingAutoUpdate={false}
                            >
                                <doseAnimationObject
                                    ref={refNocurtainAnimation}
                                    position={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.position
                                    }
                                    rotation={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.rotation
                                    }
                                    scale={
                                        VOLUMEDATA.XRay_nocurtain_Configure
                                            .volume.scale
                                    }
                                    boardCoefficient={0.01}
                                >
                                    <VOLUMEDATA.XRay_nocurtain_all_Animation />
                                </doseAnimationObject>

                                <mesh position={[5, 0, 0]}>
                                    <boxBufferGeometry />
                                </mesh>
                            </volumeGroup>
                        </volumeGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
                        <VolumeAnimationControls
                            objects={[
                                refCurtainAnimation,
                                refNocurtainAnimation,
                            ]}
                            duration={16}
                        />
                        <VolumeParameterControls object={ref} />

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group
                            position={
                                VOLUMEDATA.XRay_curtain_Configure.object3d
                                    .position
                            }
                            rotation={
                                VOLUMEDATA.XRay_curtain_Configure.object3d
                                    .rotation
                            }
                            scale={
                                VOLUMEDATA.XRay_curtain_Configure.object3d.scale
                            }
                        >
                            <VOLUMEDATA.XRay_curtain_material />
                            <VOLUMEDATA.XRay_curtain_region />
                        </group>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />

                        {/* -------------------------------------------------- */}
                        {/* Enviroment */}
                        <ambientLight intensity={0.5} />

                        <Grid
                            position={[0, -0.01, 0]}
                            args={[10.5, 10.5]}
                            cellColor={"#121d7d"}
                            sectionColor={"#262640"}
                            fadeDistance={20}
                            followCamera
                            infiniteGrid
                            matrixWorldAutoUpdate={undefined}
                            getObjectsByProperty={undefined}
                            getVertexPosition={undefined}
                        />

                        {/* ================================================== */}
                        {/* UI */}
                        <Stats />

                        <GizmoHelper
                            alignment="bottom-right"
                            margin={[80, 80]}
                            renderPriority={-1}
                        >
                            <GizmoViewport
                                axisColors={[
                                    "hotpink",
                                    "aquamarine",
                                    "#3498DB",
                                ]}
                                labelColor="black"
                            />
                        </GizmoHelper>
                    </Canvas>
                </div>
            </div>
        </>
    );
}

export default XRayCurtain;
