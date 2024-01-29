/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import React from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
    Grid,
    PivotControls,
} from "@react-three/drei";

// ==========
// Volume
// ----------
// object
import { VolumeGroup } from "../../src";
// ----------
// data
import * as VOLUMEDATA from "../../components/models/VolumeData";
// ----------
// controls
import {
    VolumeParameterControls,
    VolumeXYZClippingControls,
} from "../../components/volumeRender";

import styles from "../../styles/threejs.module.css";

const Plane = ({ ...props }) => {
    return (
        <>
            <mesh {...props}>
                <planeGeometry />
            </mesh>
        </>
    );
};

const Box = ({ ...props }) => {
    return (
        <>
            <mesh {...props}>
                <boxGeometry />
            </mesh>
        </>
    );
};

/**
 * https://zenn.dev/hironorioka28/articles/8247133329d64e
 * @returns
 */
function ExampleStent() {
    const ref = React.useRef<VolumeGroup>(null!);

    /*
    useFrame((state, scene) => {
        let values = VolumeGetValueControls(ref, ["point"]);
    });
    */

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                {/* ================================================== */}
                {/* Three.js Canvas */}
                <Canvas camera={{ position: [64, 128, 64] }}>
                    {/* -------------------------------------------------- */}
                    {/* Volume Object */}
                    <volumeGroup ref={ref}>
                        {/* ========================= */}
                        {/* Stent 1 */}
                        <VOLUMEDATA.Stent
                            position={[-75, 0, 0]}
                            rotation={[-Math.PI / 2, 0, 0]}
                        />

                        {/* ========================= */}
                        {/* Stent 2 */}
                        <VOLUMEDATA.Stent
                            position={[75, 0, 0]}
                            rotation={[-Math.PI / 2, 0, 0]}
                            coefficient={0.5}
                        />
                    </volumeGroup>

                    {/* <Box scale={[10, 10, 10]} position={[-10, 4.6, -3]} /> */}
                    {/* <Box scale={[10, 10, 10]} position={[0, 0, 0]} /> */}

                    {/* -------------------------------------------------- */}
                    {/* Controls */}
                    {/* ========================= */}
                    {/* Volume Controls */}
                    {/* ------------------------- */}
                    {/* Parameter Controls */}
                    <VolumeParameterControls object={ref} />

                    {/* ------------------------- */}
                    {/* Clipping Controls */}
                    <VolumeXYZClippingControls
                        object={ref}
                        planeSize={100}
                    />

                    {/* ========================= */}
                    {/* Three.js Controls */}
                    <OrbitControls makeDefault />

                    {/* -------------------------------------------------- */}
                    {/* Enviroment */}
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

export default ExampleStent;
