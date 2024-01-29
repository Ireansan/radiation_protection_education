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

// ==========
// Model
import * as MODELS from "../../components/models";

// ==========
// Styles
import styles from "../../styles/threejs.module.css";

/**
 * https://zenn.dev/hironorioka28/articles/8247133329d64e
 * @returns
 */
function CArmModelPrototype() {
    const [CArmMatrix, setCArmMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4()
    );
    const [BedMatrix, setBedMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4()
    );

    const CArmRef = useRef<THREE.Group>(null!);
    const BedRef = useRef<THREE.Group>(null!);

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

    const getObjectbyName = (
        object: React.RefObject<THREE.Group>,
        objectName: string
    ) => {
        if (object.current && object.current.children[0]) {
            let element = object.current.children[0];
            let obj = element.getObjectByName(objectName);

            return obj;
        }

        return null;
    };

    const getBonebyName = (
        object: React.RefObject<THREE.Group>,
        boneName: string
    ) => {
        if (object.current && object.current.children[0]) {
            let element = object.current.children[0];
            let bone = element.getObjectByName(boneName);

            return bone;
        }

        return null;
    };

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                {/* ================================================== */}
                {/* Three.js Canvas */}
                <Canvas camera={{ position: [-2, 4, 2] }}>
                    {/* -------------------------------------------------- */}
                    {/* Three.js Object */}
                    {/* ========================= */}
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
                                <MODELS.CArmRough />
                            </group>
                        </PivotControls>
                    </group>

                    {/* ========================= */}
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
                            <MODELS.BedRough />
                        </group>
                    </PivotControls>

                    {/* -------------------------------------------------- */}
                    {/* Controls */}
                    {/* ========================= */}
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
                    {/* UI (three.js) */}
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

export default CArmModelPrototype;
