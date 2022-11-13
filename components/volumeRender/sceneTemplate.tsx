import React from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrthographicCamera,
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";

type sceneProps = {
    cameraInitPosition?: THREE.Vector3Tuple;
    children: React.ReactNode;
};
export function Scene({
    cameraInitPosition = [16, 32, 16],
    children,
}: sceneProps) {
    return (
        <>
            <Canvas camera={{ position: cameraInitPosition }}>
                {/* Children */}
                {children}

                {/* Camera, Control and Some Helper */}
                <ambientLight intensity={0.5} />
                <OrthographicCamera />
                <OrbitControls makeDefault />

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
            <Stats />
        </>
    );
}
