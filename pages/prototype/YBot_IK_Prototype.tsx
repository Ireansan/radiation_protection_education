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

type IKPositionData = {
    init: THREE.Vector3;
    data: THREE.Vector3;
};

function CustomYBotIKPrototype() {
    const group = useRef<THREE.Group>(null!);
    const [LeftIKPosition, setLeftIKPosition] = useState({
        init: new THREE.Vector3(0.3, 0.8, 0),
        data: new THREE.Vector3(0.3, 0.8, 0),
    });
    const [RightIKPosition, setRightIKPosition] = useState({
        init: new THREE.Vector3(-0.3, 0.8, 0),
        data: new THREE.Vector3(-0.3, 0.8, 0),
    });

    function setIKPosition(
        ikName: string,
        ikParentName: string,
        ikPosition: THREE.Vector3
    ) {
        if (group.current) {
            let tmpIk = group.current.getObjectByName(ikName);
            let tmpIkParent = group.current.getObjectByName(ikParentName);

            if (tmpIk && tmpIkParent) {
                // get world position of group
                let parentWorldPosition = new THREE.Vector3();
                group.current.getWorldPosition(parentWorldPosition);

                // add IK position to world position
                let tmpIkPosition = parentWorldPosition.clone().add(ikPosition);
                tmpIk.position.copy(tmpIkParent.worldToLocal(tmpIkPosition));
            }
        }
    }

    /**
     * leva controls
     */
    // h(y): 0.8 - 1.5 (world)
    // d(z): 0 - 0.6 (world)
    const [ikConfig, setIK] = useControls(() => ({
        "Hand Position": folder({
            Left: folder({
                LeftDepth: {
                    value: 0,
                    min: 0,
                    max: 1,
                    label: "Depth",
                    onChange: (e) => {
                        let position = LeftIKPosition.data.clone();
                        position.setZ(0.6 * e + LeftIKPosition.init.z);

                        LeftIKPosition.data.copy(position);
                        setIKPosition(
                            "mixamorigLeftHandIK",
                            "mixamorigLeftShoulder",
                            position
                        );
                    },
                },
                LeftHeight: {
                    value: 0,
                    min: 0,
                    max: 1,
                    label: "Height",
                    onChange: (e) => {
                        let position = LeftIKPosition.data.clone();
                        position.setY(0.7 * e + LeftIKPosition.init.y);

                        LeftIKPosition.data.copy(position);
                        setIKPosition(
                            "mixamorigLeftHandIK",
                            "mixamorigLeftShoulder",
                            position
                        );
                    },
                },
            }),
            Right: folder({
                RightDepth: {
                    value: 0,
                    min: 0,
                    max: 1,
                    label: "Depth",
                    onChange: (e) => {
                        let position = RightIKPosition.data.clone();
                        position.setZ(0.6 * e + RightIKPosition.init.z);

                        RightIKPosition.data.copy(position);
                        setIKPosition(
                            "mixamorigRightHandIK",
                            "mixamorigRightShoulder",
                            position
                        );
                    },
                },
                RightHeight: {
                    value: 0,
                    min: 0,
                    max: 1,
                    label: "Height",
                    onChange: (e) => {
                        let position = RightIKPosition.data.clone();
                        position.setY(0.7 * e + RightIKPosition.init.y);

                        RightIKPosition.data.copy(position);
                        setIKPosition(
                            "mixamorigRightHandIK",
                            "mixamorigRightShoulder",
                            position
                        );
                    },
                },
            }),
        }),
    }));

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
