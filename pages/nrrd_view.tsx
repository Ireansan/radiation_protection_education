/**
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 */

import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState, Suspense } from "react";

import { Canvas, useThree } from "@react-three/fiber";
import {
    OrbitControls,
    TransformControls,
    Stats,
    GizmoHelper,
    GizmoViewport,
} from "@react-three/drei";
import type { TransformControls as TransformControlsType } from "@react-three/drei";
import * as THREE from "three";
import { TransformControls as TransformControlsLib } from "three-stdlib";
import { useControls } from "leva";
import { useSnapshot } from "valtio";
import { useStore } from "zustand";

import { VolumeRender } from "./components/volumeRender";
import {
    volumeRenderStates,
    // clippingPlaneStates,
    clippingPlaneStore,
    transformConfigStates,
} from "./states/nrrd_view.states";

import styles from "../styles/nrrd_view.module.css";

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

const degreeToRad = (d: number): number => {
    return (Math.PI / 180) * d;
};
const radToDegree = (r: number): number => {
    return (180 / Math.PI) * r;
};

function VolumeRenderControls() {
    const [volumeConfig, volumeSet] = useControls(() => ({
        clim1: {
            value: 0,
            min: 0,
            max: 1,
            onChange: (e) => {
                volumeRenderStates.clim1 = e;
            },
        },
        clim2: {
            value: 1,
            min: 0,
            max: 1,
            onChange: (e) => {
                volumeRenderStates.clim2 = e;
            },
        },
        colormap: {
            options: ["viridis", "gray"],
            onChange: (e) => {
                if (e === "viridis") {
                    volumeRenderStates.colormap = 0;
                } else if (e === "gray") {
                    volumeRenderStates.colormap = 1;
                }
            },
        },
        renderstyle: {
            options: ["iso", "mip"],
            onChange: (e) => {
                volumeRenderStates.renderstyle = e;
            },
        },
        isothreshold: {
            value: 0.15,
            min: 0,
            max: 1,
            // max: 100,
            onChange: (e) => {
                volumeRenderStates.isothreshold = e;
            },
        },
    }));

    return <></>;
}

function ClippingPlaneTransformControls() {
    const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());
    const { camera, gl } = useThree();
    const transformRef = useRef<TransformControlsLib>(
        new TransformControlsLib(camera, gl.domElement)
    );
    // const { plane, position, constant, updatePlane } =
    //     useSnapshot(clippingPlaneStates);
    const { plane, position, setPosition, matrix, setMatrix, setPlane } =
        clippingPlaneStore();
    const { mode, space, position_base, rotation_base } = useSnapshot(
        transformConfigStates
    );
    const [planeConfig, setConfig] = useControls(() => ({
        position: {
            value: { x: 0, y: 0, z: 0 },
            onChange: (e) => {
                const position_ = new THREE.Vector3(e.x, e.y, e.z);
                setPosition(position_);
                setPlane();

                meshRef.current.position.copy(position_);
                // transformRef.current.gizmo.worldPostion?.copy(position_);
                // transformRef.current.worldPostion?.copy(position_);
                const matrix_ = new THREE.Matrix4();
                matrix_.copy(matrix);
                matrix_.setPosition(position_);
                // transformRef.current.children[0].worldPosition.copy(position_);

                console.log(
                    "event planeConfig translate",
                    e,
                    position,
                    transformRef.current,
                    transformRef.current.children[0],
                    transformRef.current.children[1]
                );

                const event: Event = new Event("objectChange");
                gl.domElement.dispatchEvent(event);
            },
            step: 1,
        },
        rotation: {
            value: { x: 0, y: 0, z: 0 },
            onChange: (e) => {
                const rotation_ = new THREE.Euler(
                    degreeToRad(e.x),
                    degreeToRad(e.y),
                    degreeToRad(e.z)
                );
                const matrix_ = new THREE.Matrix4();
                matrix_.makeRotationFromEuler(rotation_);
                setMatrix(matrix_);
                setPlane();

                // meshRef.current.rotation.copy(rotation_);
                const quaternion_: THREE.Quaternion = new THREE.Quaternion();
                quaternion_.setFromEuler(rotation_);
                meshRef.current.quaternion.copy(quaternion_);
                // transformRef.current.gizmo.worldQuaternion?.copy(quaternion_);
                transformRef.current.applyMatrix4(matrix_);

                console.log(
                    "event planeConfig rotate",
                    e,
                    rotation_,
                    matrix_,
                    matrix
                    // transformRef.current,
                );
            },
            step: 1,
        },
        mode: {
            value: "translate",
            options: ["translate", "rotate"],
            onChange: (e) => {
                transformConfigStates.mode = e;
            },
        },
        space: {
            value: "world",
            options: ["world", "local"],
            onChange: (e) => {
                transformConfigStates.space = e;
            },
        },
    }));
    // console.log(mode, space);
    useEffect(() => {}, []);

    return (
        <>
            <TransformControls
                ref={transformRef}
                mode={mode}
                space={space}
                onObjectChange={(e) => {
                    if (mode === "translate") {
                        const position_: THREE.Vector3 =
                            // transformRef.current.gizmo.worldPosition ??
                            e?.target.object.position ?? new THREE.Vector3();
                        setConfig({
                            position: {
                                x: position_.x,
                                y: position_.y,
                                z: position_.z,
                            },
                        });
                        console.log(
                            "chnage Obj translate",
                            position_,
                            e?.target.object.position
                        );
                    } else if (mode === "rotate") {
                        const rotation_euler: THREE.Euler =
                            transformRef.current.rotation ?? new THREE.Euler();
                        setConfig({
                            rotation: {
                                x: radToDegree(rotation_euler.x),
                                y: radToDegree(rotation_euler.y),
                                z: radToDegree(rotation_euler.z),
                            },
                        });
                        console.log(
                            "chnage Obj rotate",
                            e?.target.object.rotation,
                            e?.target.object.quaternion
                        );
                    }
                }}
            />
            <planeHelper args={[plane, 250]} />
            <mesh ref={meshRef} scale={[100, 100, 100]}>
                <planeGeometry />
            </mesh>
        </>
    );
}

/**
 * https://zenn.dev/hironorioka28/articles/8247133329d64e
 * @returns
 */
function NRRDView() {
    const h = 512; // frustum height
    const camera = new THREE.OrthographicCamera();

    useEffect(() => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.copy(
            new THREE.OrthographicCamera(
                (-h * aspect) / 2,
                (h * aspect) / 2,
                h / 2,
                -h / 2,
                0.001,
                1000
            )
        );
        camera.position.set(-64, -64, 128);
        camera.up.set(0, 0, 1); // In our data, z is up
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <Canvas camera={camera}>
                    <Suspense fallback={null}>
                        <VolumeRender />
                    </Suspense>

                    <VolumeRenderControls />
                    <ClippingPlaneTransformControls />
                    <Plane />
                    <OrbitControls makeDefault />

                    {/* <Box scale={[5, 50, 5]} position={[-10, 4.6, -3]} /> */}

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

export default NRRDView;
