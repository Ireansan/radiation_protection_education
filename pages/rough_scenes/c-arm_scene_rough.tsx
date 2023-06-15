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

function CArmObject({ ...props }: JSX.IntrinsicElements["group"]) {
    const CArmRef = useRef<THREE.Group>(null!);

    function getBonebyName(boneName: string) {
        if (CArmRef.current.children[0]) {
            let element = CArmRef.current.children[0];
            let armBaseBone = element.getObjectByName(boneName);

            return armBaseBone;
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
                    let bone = getBonebyName("ArmRoll");

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
                    let bone = getBonebyName("ArmPitch");

                    if (bone) {
                        bone.rotation.x = rad;
                    }
                },
            },
        }),
    }));

    useFrame(() => {
        // console.log(CArmRef.current);
    });

    return (
        <>
            <PivotControls
                offset={[0, 0, -0.25]}
                rotation={[0, Math.PI, 0]}
                activeAxes={[true, false, true]}
            >
                <group ref={CArmRef}>
                    <Models.CArmRough />
                </group>
            </PivotControls>
        </>
    );
}

function BedObject({ ...props }: JSX.IntrinsicElements["group"]) {
    const BedRef = useRef<THREE.Group>(null!);

    const [volumeConfig, setVolume] = useControls(() => ({
        Bed: folder({
            opacity: {
                value: 1,
                min: 0,
                max: 1,
                onChange: (e) => {},
            },
        }),
    }));

    useFrame(() => {
        // console.log(BedRef.current);
    });

    return (
        <>
            <PivotControls
                offset={[0, 0, -0.25]}
                rotation={[0, Math.PI, 0]}
                activeAxes={[true, false, true]}
            >
                <group ref={BedRef}>
                    <Models.BedRough />
                </group>
            </PivotControls>
        </>
    );
}

/**
 * https://zenn.dev/hironorioka28/articles/8247133329d64e
 * @returns
 */
function CArmSceneRough() {
    /*
    useEffect(() => {
        console.log(CArmRef.current, BedRef.current);
    }, [CArmRef, BedRef]);
    */

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <Canvas>
                    {/* <Sphere /> */}

                    {/* -------------------------------------------------- */}
                    {/* Three.js Object */}
                    <CArmObject />
                    <BedObject />

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
            </div>
        </div>
    );
}

export default CArmSceneRough;
