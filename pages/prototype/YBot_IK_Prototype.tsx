import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { useControls, folder } from "leva";

import styles from "../../styles/threejs.module.css";
import { CustomYBotIK } from "../../components/models/Custom_Ybot_IK";

import {
    HandIKLevaControls,
    HandIKPivotControls,
} from "../../components/models/controls";

type IKPositionData = {
    init: THREE.Vector3;
    data: THREE.Vector3;
};

function CustomYBotIKPrototype() {
    const group = useRef<THREE.Group>(null!);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.canvas}>
                    {/* ================================================== */}
                    {/* Three.js Canvas */}
                    <Canvas camera={{ position: [0, 3, 2] }}>
                        {/* -------------------------------------------------- */}
                        {/* Three.js Object */}
                        <PivotControls activeAxes={[true, false, true]}>
                            <group ref={group}>
                                <CustomYBotIK />
                            </group>
                            <HandIKPivotControls object={group} />
                        </PivotControls>

                        {/* -------------------------------------------------- */}
                        {/* Three.js Controls */}
                        <OrbitControls makeDefault />
                        <HandIKLevaControls object={group} />

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
