import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    PivotControls,
    Sphere,
    Grid,
} from "@react-three/drei";
import * as THREE from "three";
import { useControls, folder, button } from "leva";

import { VolumeGroup, VolumeAnimationObject } from "../../src";
import {
    VolumeAnimationControls,
    VolumeClippingControls,
    VolumeParameterControls,
} from "../../components/volumeRender";
import * as Models from "../../components/models";
import * as VOLUMEDATA from "../../components/models/VolumeData";

import styles from "../../styles/threejs.module.css";

function XRayScale() {
    // FIXME:
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<VolumeAnimationObject>(null);

    // NOTE: This params is use
    const cameraInitPosition = new THREE.Vector3(4, 8, 4);
    const doseWorldPosition = new THREE.Vector3(2.1, 2.2, 2.35);
    const doseScale = 1 / 19;
    const materialsWorldPosition = new THREE.Vector3(-0.195, 2.05, -0.19);
    const materialsScale = 1 / 5;

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
                        camera={{
                            position: cameraInitPosition,
                        }}
                    >
                        {/* -------------------------------------------------- */}
                        {/* Volume Object */}

                        <volumeGroup
                            ref={ref}
                            position={doseWorldPosition}
                            scale={doseScale}
                        >
                            {/* Dose */}
                            <volumeAnimationObject
                                ref={refAnimation}
                                // position={[45, 0, 48]}
                                rotation={[0, Math.PI, -Math.PI / 2]}
                            >
                                <VOLUMEDATA.Dose_all_Animation />
                            </volumeAnimationObject>
                        </volumeGroup>

                        {/* -------------------------------------------------- */}
                        {/* Volume Controls */}
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
                            planeSize={5}
                            subPlaneSize={1}
                        />

                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group
                            position={materialsWorldPosition}
                            rotation={[0, 0, Math.PI]}
                            scale={doseScale * materialsScale} // 1 / 20
                        >
                            <VOLUMEDATA.Dose_material />
                            <VOLUMEDATA.Dose_region />
                        </group>
                        <PivotControls
                            matrix={new THREE.Matrix4().setPosition(4, 0, 0)}
                            activeAxes={[true, false, true]}
                        >
                            <Models.YBot />
                        </PivotControls>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />

                        <Grid
                            position={[0, -0.01, 0]}
                            args={[10.5, 10.5]}
                            cellColor={"#3f3f3f"}
                            sectionColor={"#9d4b4b"}
                            matrixWorldAutoUpdate={undefined}
                            getObjectsByProperty={undefined}
                            getVertexPosition={undefined}
                        />

                        {/* -------------------------------------------------- */}
                        {/* Enviroment */}
                        <ambientLight intensity={0.5} />

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
                </div>
            </div>
        </>
    );
}

export default XRayScale;
