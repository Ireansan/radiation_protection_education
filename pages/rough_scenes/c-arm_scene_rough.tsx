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
} from "@react-three/drei";
import * as THREE from "three";
import { useControls, folder, button } from "leva";

import * as Models from "../../components/models";

import styles from "../../styles/threejs.module.css";

/**
 * https://zenn.dev/hironorioka28/articles/8247133329d64e
 * @returns
 */
function CArmSceneRough() {
    const CArmRef = useRef<THREE.Group>(null!);
    const BedRef = useRef<THREE.Group>(null!);

    const [CArmMatrix, setCArmMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4()
    );
    const [BedMatrix, setBedMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4()
    );

    function getObjectbyName(
        object: React.RefObject<THREE.Group>,
        objectName: string
    ) {
        if (object.current && object.current.children[0]) {
            let element = object.current.children[0];
            let obj = element.getObjectByName(objectName);

            return obj;
        }

        return null;
    }

    function getBonebyName(
        object: React.RefObject<THREE.Group>,
        boneName: string
    ) {
        if (object.current && object.current.children[0]) {
            let element = object.current.children[0];
            let bone = element.getObjectByName(boneName);

            return bone;
        }

        return null;
    }

    const [volumeConfig, setVolume] = useControls(() => ({
        "C-Arm": folder({
            Roll: {
                value: 0,
                min: -180,
                max: 180,
                onChange: (e) => {
                    let rad = (e * Math.PI) / 180;
                    let bone = getBonebyName(CArmRef, "ArmRoll");

                    if (bone) {
                        bone.rotation.y = rad;
                    }
                },
            },
            Pitch: {
                value: 0,
                min: -90,
                max: 90,
                onChange: (e) => {
                    let rad = ((-e - 90) * Math.PI) / 180;
                    let bone = getBonebyName(CArmRef, "ArmPitch");

                    if (bone) {
                        bone.rotation.x = rad;
                    }
                },
            },
        }),
        Bed: folder({
            "Height [m]": {
                value: 0.7207213044166565,
                min: 0.5,
                max: 1,
                onChange: (e) => {
                    let bone = getBonebyName(BedRef, "Bed_1");

                    if (bone) {
                        bone.position.y = e;
                    }
                },
            },
            "Slide [m]": {
                value: 0,
                min: -0.5,
                max: 0.5,
                onChange: (e) => {
                    let bone = getBonebyName(BedRef, "Bed_1");

                    if (bone) {
                        bone.position.z = e;
                    }
                },
            },
        }),
    }));

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <Canvas camera={{ position: [-2, 4, 2] }}>
                    {/* <Sphere /> */}

                    {/* -------------------------------------------------- */}
                    {/* Three.js Object */}
                    {/* C-Arm */}
                    <group position={[0, 0, -1.7]}>
                        <PivotControls
                            offset={[0, 0, -0.25]}
                            rotation={[0, Math.PI, 0]}
                            activeAxes={[true, false, true]}
                            onDragEnd={() => {
                                console.log(CArmRef.current);
                            }}
                        >
                            <group ref={CArmRef}>
                                <Models.CArmRough />
                            </group>
                        </PivotControls>
                    </group>

                    {/* Bed */}
                    <PivotControls
                        offset={[0, 0, -0.5]}
                        rotation={[0, Math.PI, 0]}
                        activeAxes={[true, false, true]}
                        onDragEnd={() => {
                            console.log(BedRef.current);
                        }}
                    >
                        <group ref={BedRef}>
                            <Models.BedRough />
                        </group>
                    </PivotControls>

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
                        renderPriority={1}
                    >
                        <GizmoViewport
                            axisColors={["hotpink", "aquamarine", "#3498DB"]}
                            labelColor="black"
                        />
                    </GizmoHelper>
                </Canvas>
            </div>
        </div>
    );
}

export default CArmSceneRough;
