import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { TransformControls as TransformControlsLib } from "three-stdlib";
import { useControls, folder } from "leva";
import { useSnapshot } from "valtio";

import {
    clippingPlaneTransformControlsStates,
    clippingPlaneStore,
} from "../states";

/**
 * @function ClippingPlaneTransformControls
 * @abstract
 */
function ClippingPlaneTransformControls() {
    const { plane, setPosition, setMatrix, setPlane } = clippingPlaneStore();
    const { mode, space, position, rotation } = useSnapshot(
        clippingPlaneTransformControlsStates
    );

    const planeHelperRef = useRef<THREE.PlaneHelper>(
        new THREE.PlaneHelper(new THREE.Plane())
    );
    const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());
    const { camera, gl } = useThree();
    const transformRef = useRef<TransformControlsLib>(
        new TransformControlsLib(camera, gl.domElement)
    );

    const planeConfig = useControls("transform", {
        mode: {
            value: "translate",
            options: ["translate", "rotate"],
            onChange: (e) => {
                clippingPlaneTransformControlsStates.mode = e;
            },
        },
        space: {
            value: "world",
            options: ["world", "local"],
            onChange: (e) => {
                clippingPlaneTransformControlsStates.space = e;
            },
        },
    });

    useEffect(() => {
        planeHelperRef.current.plane = plane;
        planeHelperRef.current.size = 250;

        meshRef.current.position.copy(position);
        meshRef.current.rotation.copy(rotation);
    });

    const onObjectChange = (e: THREE.Event | undefined) => {
        if (mode === "translate") {
            const position_: THREE.Vector3 =
                e?.target.object.position ?? new THREE.Vector3();

            setPosition(position_);
            setPlane();

            meshRef.current.position.copy(position_);
            clippingPlaneTransformControlsStates.position.copy(position_);
        } else if (mode === "rotate") {
            const rotation_: THREE.Euler =
                e?.target.object.rotation ?? new THREE.Euler();
            const matrix_ = new THREE.Matrix4();
            matrix_.makeRotationFromEuler(rotation_);

            setMatrix(matrix_);
            setPlane();

            meshRef.current.rotation.copy(rotation_);
            clippingPlaneTransformControlsStates.rotation.copy(rotation_);
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
            <planeHelper ref={planeHelperRef} />
            <mesh ref={meshRef} scale={[100, 100, 100]}>
                <planeGeometry />
            </mesh>
        </>
    );
}

export default ClippingPlaneTransformControls;
