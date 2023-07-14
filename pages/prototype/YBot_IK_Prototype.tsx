import React, { useEffect, useMemo, useRef } from "react";
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

import styles from "../../styles/threejs.module.css";
import { CustomYBotIK } from "../../components/models/Custom_Ybot_IK";

function CustomYBotIKPrototype() {
    const group = useRef<THREE.Group>(null!);

    function setIKPosition(name: string, parentName: string, w: THREE.Matrix4) {
        if (group.current) {
            let tmp = group.current.getObjectByName(name);
            let tmpParent = group.current.getObjectByName(parentName);

            if (tmp && tmpParent) {
                let worldPosition = new THREE.Vector3().setFromMatrixPosition(
                    w
                );
                tmp.position.copy(tmpParent.worldToLocal(worldPosition));
            }
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.canvas}>
                    {/* ================================================== */}
                    {/* Three.js Canvas */}
                    <Canvas camera={{ position: [0, 3, 2] }}>
                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <group ref={group}>
                            <CustomYBotIK />
                        </group>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />

                        {/* Left Hand IK */}
                        <PivotControls
                            scale={0.5}
                            onDragStart={() => console.log("Left Hand IK")}
                            onDrag={(l, deltaL, w, deltaW) => {
                                setIKPosition(
                                    "mixamorigLeftHandIK",
                                    "mixamorigLeftShoulder",
                                    w
                                );
                            }}
                        />
                        {/* Right Hand IK */}
                        <PivotControls
                            scale={0.5}
                            onDragStart={() => console.log("Right Hand IK")}
                            onDrag={(l, deltaL, w, deltaW) => {
                                setIKPosition(
                                    "mixamorigRightHandIK",
                                    "mixamorigRightShoulder",
                                    w
                                );
                            }}
                        />

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

export default CustomYBotIKPrototype;
