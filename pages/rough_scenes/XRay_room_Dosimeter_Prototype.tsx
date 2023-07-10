import React, { useEffect, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    PivotControls,
    Grid,
} from "@react-three/drei";
import * as THREE from "three";

import { Dosimeter, VolumeGroup, VolumeAnimationObject } from "../../src";
import {
    DoseBoardControls,
    DosimeterControls,
    VolumeAnimationControls,
    VolumeClippingControls,
    VolumeParameterControls,
    DosimeterDisplayUI,
} from "../../components/volumeRender";

import * as VOLUMEDATA from "../../components/models/VolumeData";
import { YBot } from "../../components/models";

import styles from "../../styles/threejs.module.css";

function XRayRoomDosimeterPrototype() {
    // FIXME:
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation1 = useRef<VolumeAnimationObject>(null);
    const refAnimation2 = useRef<VolumeAnimationObject>(null);

    const dosimeterRef = useRef<Dosimeter>(null);
    const yBotRef = useRef<THREE.Group>(null);

    useEffect(() => {
        console.log(ref.current);
        // console.log(refAnimation);
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
                        {/* Volume Object */}
                        <volumeGroup ref={ref}>
                            {/* Original Data */}
                            <volumeAnimationObject
                                ref={refAnimation1}
                                position={
                                    VOLUMEDATA.Dose_Configure.volume.position
                                }
                                rotation={
                                    VOLUMEDATA.Dose_Configure.volume.rotation
                                }
                                scale={VOLUMEDATA.Dose_Configure.volume.scale}
                            >
                                <VOLUMEDATA.Dose_all_Animation />
                            </volumeAnimationObject>

                            {/* Data * 0.01 */}
                            <volumeAnimationObject
                                ref={refAnimation2}
                                position={
                                    VOLUMEDATA.Dose_Configure.volume.position
                                }
                                rotation={
                                    VOLUMEDATA.Dose_Configure.volume.rotation
                                }
                                scale={VOLUMEDATA.Dose_Configure.volume.scale}
                            >
                                <VOLUMEDATA.Dose_all_Animation_centi />
                            </volumeAnimationObject>
                        </volumeGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
                        <VolumeAnimationControls
                            objects={[refAnimation1, refAnimation2]}
                            duration={16}
                        />
                        <VolumeParameterControls object={ref} />
                        {/* <VolumeClippingControls
                            object={ref}
                            folderName="Dose 2"
                            normals={[
                                // [0, 0, -1],
                                // [1, 0, 0],
                                // [-1, 0, 0],
                                // [0, 1, 0],
                                [0, -1, 0],
                            ]}
                            planeSize={2}
                            subPlaneSize={1}
                        /> */}
                        <DoseBoardControls
                            object1={refAnimation1}
                            object2={refAnimation2}
                            origin={new THREE.Vector3(0, 1, 0)}
                            width={1}
                            height={2}
                            planeSize={2}
                            subPlaneSize={1}
                        >
                            <mesh position={[0, 0, 0]}>
                                <boxBufferGeometry args={[1, 2, 0.05]} />
                            </mesh>
                        </DoseBoardControls>
                        <DosimeterControls
                            ref={dosimeterRef}
                            object={yBotRef}
                            names={[
                                { name: "mixamorigNeck", displayName: "Neck" },
                                {
                                    name: "mixamorigLeftHand",
                                    displayName: "Left Hand",
                                },
                                {
                                    name: "mixamorigRightHand",
                                    displayName: "Right Hand",
                                },
                            ]}
                            targets={[refAnimation1, refAnimation2]}
                        />

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group
                            position={
                                VOLUMEDATA.Dose_Configure.object3d.position
                            }
                            rotation={
                                VOLUMEDATA.Dose_Configure.object3d.rotation
                            }
                            scale={
                                VOLUMEDATA.Dose_Configure.volume.scale *
                                VOLUMEDATA.Dose_Configure.object3d.scale
                            }
                        >
                            <VOLUMEDATA.Dose_material />
                            <VOLUMEDATA.Dose_region />
                        </group>
                        <mesh position={[0, 1, 0]}>
                            <sphereBufferGeometry args={[0.25]} />
                        </mesh>

                        <PivotControls
                            // offset={[0, 0, -0.5]}
                            // rotation={[0, Math.PI, 0]}
                            activeAxes={[true, false, true]}
                            onDragEnd={() => {
                                if (dosimeterRef.current) {
                                    dosimeterRef.current.updateResults();
                                    console.log(
                                        // dosimeterRef.current,
                                        // yBotRef.current?.position,
                                        dosimeterRef.current.results
                                        // dosimeterRef.current?.object
                                    );
                                }
                            }}
                        >
                            <group ref={yBotRef}>
                                <YBot />
                            </group>
                        </PivotControls>

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

                        {/* -------------------------------------------------- */}
                        {/* UI */}
                        <Stats />

                        <GizmoHelper
                            alignment="bottom-right"
                            margin={[80, 80]}
                            renderPriority={1}
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
                    <DosimeterDisplayUI />
                </div>
            </div>
        </>
    );
}

export default XRayRoomDosimeterPrototype;
