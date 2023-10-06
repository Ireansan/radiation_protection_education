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

// ==========
// Three.js
import * as MODELS from "../../components/models";

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

function XRayPositionScale() {
    const ref = useRef<VolumeGroup>(null!);
    const refAnimation = useRef<DoseAnimationObject>(null);

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
                        camera={{ position: cameraInitPosition, zoom: 50 }}
                    >
                        {/* -------------------------------------------------- */}
                        {/* Volume Object */}

                        <volumeGroup
                            ref={ref}
                            position={doseWorldPosition}
                            scale={doseScale}
                        >
                            {/* Dose */}
                            <doseAnimationObject
                                ref={refAnimation}
                                // position={[45, 0, 48]}
                                rotation={[0, Math.PI, -Math.PI / 2]}
                            >
                                <VOLUMEDATA.XRay_nocurtain_all_Animation />
                            </doseAnimationObject>
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
                            <VOLUMEDATA.XRay_nocurtain_material />
                            <VOLUMEDATA.XRay_nocurtain_region />
                        </group>
                        <PivotControls
                            matrix={new THREE.Matrix4().setPosition(4, 0, 0)}
                            activeAxes={[true, false, true]}
                        >
                            <MODELS.YBot />
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

                        {/* ================================================== */}
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

export default XRayPositionScale;
