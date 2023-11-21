import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

import styles from "../../styles/css/coordHtml.module.css";

export function CoordHTML({ ...props }) {
    const ref = React.useRef<THREE.Mesh>(null!);

    useFrame(() => {
        console.log(
            // new THREE.Vector3().setFromMatrixPosition(ref.current.matrixWorld)
            new THREE.Euler().setFromRotationMatrix(ref.current.matrixWorld)
        );
    });

    return (
        <>
            <mesh ref={ref}>
                <Html distanceFactor={undefined}>
                    <div className={`${styles.content}`}>
                        hello <br />
                        world
                    </div>
                </Html>
            </mesh>
        </>
    );
}
