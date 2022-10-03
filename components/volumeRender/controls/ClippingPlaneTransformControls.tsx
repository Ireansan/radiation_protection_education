import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { TransformControls as TransformControlsLib } from "three-stdlib";
import { useControls, folder } from "leva";
import { useSnapshot } from "valtio";

import {
    transformConfigStates,
    typeConfigStates,
} from "../../../lib/states/volumeRender.Controls.state";
import clippingPlaneStore from "../../../lib/states/clippingPlane.state";

/** */
function ClippingPlaneTransformControls() {
    const { plane, setPosition, setMatrix, setPlane } = clippingPlaneStore();
    const { mode, space } = useSnapshot(transformConfigStates);
    const { transfromControlsStates } = useSnapshot(typeConfigStates);

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
    });

    useEffect(() => {
        planeHelperRef.current.plane = plane;
        planeHelperRef.current.size = 250;

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
            <planeHelper ref={planeHelperRef} />
            <mesh ref={meshRef} scale={[100, 100, 100]}>
                <planeGeometry />
            </mesh>
        </>
    );
}

export default ClippingPlaneTransformControls;
