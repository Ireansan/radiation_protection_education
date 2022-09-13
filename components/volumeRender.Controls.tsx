import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { TransformControls as TransformControlsLib } from "three-stdlib";
import { useControls, folder } from "leva";
import { useSnapshot } from "valtio";

import volumeRenderStates from "../lib/states/volumeRender.state";
import {
    transformConfigStates,
    typeConfigStates,
    animationStates,
} from "../lib/states/volumeRender.Controls.state";
import clippingPlaneStore from "../lib/states/clippingPlane.state";

/** */
const degreeToRad = (d: number): number => {
    return (Math.PI / 180) * d;
};

/** */
function VolumeRenderConfigControls() {
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

/** */
function ClippingPlaneTransformControls() {
    const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());
    const { camera, gl } = useThree();
    const transformRef = useRef<TransformControlsLib>(
        new TransformControlsLib(camera, gl.domElement)
    );
    const { plane, setPosition, setMatrix, setPlane } = clippingPlaneStore();
    const { mode, space } = useSnapshot(transformConfigStates);
    const { transfromControlsStates } = useSnapshot(typeConfigStates);
    const [planeConfig, setConfig] = useControls(() => ({
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

    useEffect(() => {
        console.log("transformControls");
        meshRef.current.position.copy(transfromControlsStates.position);
        meshRef.current.rotation.copy(transfromControlsStates.rotation);
    });

    const onObjectChange = (e: THREE.Event | undefined) => {
        if (mode === "translate") {
            const position_: THREE.Vector3 =
                e?.target.object.position ?? new THREE.Vector3();

            setPosition(position_);
            setPlane();

            meshRef.current.position.copy(position_);
            typeConfigStates.transfromControlsStates.position.copy(position_);
        } else if (mode === "rotate") {
            const rotation_: THREE.Euler =
                e?.target.object.rotation ?? new THREE.Euler();
            const matrix_ = new THREE.Matrix4();
            matrix_.makeRotationFromEuler(rotation_);

            setMatrix(matrix_);
            setPlane();

            meshRef.current.rotation.copy(rotation_);
            typeConfigStates.transfromControlsStates.rotation.copy(rotation_);
        }
    };

    return (
        <>
            <TransformControls
                ref={transformRef}
                mode={mode}
                space={space}
                onObjectChange={(e) => {
                    onObjectChange(e);
                }}
            />
            <planeHelper args={[plane, 250]} />
            <mesh ref={meshRef} scale={[100, 100, 100]}>
                <planeGeometry />
            </mesh>
        </>
    );
}

/** */
function ClippingPlaneControls() {
    const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());
    const { plane, setPosition, setMatrix, setPlane } = clippingPlaneStore();
    const [planeConfig, setConfig] = useControls(() => ({
        position: {
            value: { x: 0, y: 0, z: 0 },
            onChange: (e) => {
                const position_ = new THREE.Vector3(e.x, e.y, e.z);

                setPosition(position_);
                setPlane();

                meshRef.current.position.copy(position_);
                typeConfigStates.controlsStates.position.copy(position_);
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

                meshRef.current.rotation.copy(rotation_);
                typeConfigStates.controlsStates.rotation.copy(rotation_);
            },
            step: 1,
        },
    }));

    return (
        <>
            <planeHelper args={[plane, 250]} />
            <mesh ref={meshRef} scale={[100, 100, 100]}>
                <planeGeometry />
            </mesh>
        </>
    );
}

/** */
function AnimationControls() {
    const { animate } = useSnapshot(animationStates);
    const animationCofig = useControls("animation", {
        animate: {
            value: true,
            onChange: (e) => {
                animationStates.animate = e;
            },
        },
        speed: {
            value: 0.3,
            min: 0,
            max: 2,
            render: () => animate,
            onChange: (e) => {
                animationStates.speed = e;
            },
        },
    });

    return <></>;
}

/** */
function VolumeRenderControls() {
    const { position, setPosition, matrix, setMatrix, setPlane } =
        clippingPlaneStore();
    const { configType, controlsStates, transfromControlsStates } =
        useSnapshot(typeConfigStates);
    const { animation } = useSnapshot(animationStates);

    const [typeConfig, setConfig] = useControls(() => ({
        type: {
            value: "type 1",
            options: ["type 1", "type 2"],
            onChange: (e) => {
                const position_: THREE.Vector3 = new THREE.Vector3();
                const matrix_: THREE.Matrix4 = new THREE.Matrix4();

                if (e === "type 1") {
                    position_.copy(transfromControlsStates.position);
                    matrix_.makeRotationFromEuler(
                        transfromControlsStates.rotation
                    );
                    typeConfigStates.configType = e;
                } else if (e === "type 2") {
                    position_.copy(controlsStates.position);
                    matrix_.makeRotationFromEuler(controlsStates.rotation);
                    typeConfigStates.configType = e;
                }

                setPosition(position_);
                setMatrix(matrix_);
                setPlane();
            },
        },
    }));

    return (
        <>
            <VolumeRenderConfigControls />
            {configType === "type 1" && <ClippingPlaneTransformControls />}
            {configType === "type 2" && <ClippingPlaneControls />}
            {animation && <AnimationControls />}
        </>
    );
}

export default VolumeRenderControls;
