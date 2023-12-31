import React from "react";
import * as THREE from "three";
import { useCursor, PivotControls } from "@react-three/drei";
import type { Target } from "../core/types";

/**
 * Controls
 */
export type pivotControlsProps = {
    target: Target;
    planes: THREE.Plane[];
    matrix: THREE.Matrix4;
};
export function ClippingPlanesPivotControls({
    target,
    planes,
    matrix,
}: pivotControlsProps) {
    const pivotRef = React.useRef<THREE.Group>(null!);

    function onDrag(
        l: THREE.Matrix4,
        deltaL: THREE.Matrix4,
        w: THREE.Matrix4,
        deltaW: THREE.Matrix4
    ) {
        const direction = new THREE.Vector3();
        const position = new THREE.Vector3();
        matrix.copy(w);

        if (target.object) {
            var rotationMatrix = new THREE.Matrix4().extractRotation(w);
            target.object.position.setFromMatrixPosition(w);
            target.object.rotation.setFromRotationMatrix(rotationMatrix);

            position.copy(target.object.position);

            target.object.getWorldDirection(direction);
            direction.normalize().multiplyScalar(-1);

            planes[target.id].normal.copy(direction);
            planes[target.id].constant = -position.dot(direction);
        }
    }

    return (
        <PivotControls
            ref={pivotRef}
            matrix={matrix}
            autoTransform={true}
            onDrag={(l, deltaL, w, deltaW) => {
                onDrag(l, deltaL, w, deltaW);
            }}
        />
    );
}

/**
 * Plane Helper Mesh
 */
export type planeHelperMeshProps = {
    width?: number;
    height?: number;
    subPlaneColor?: THREE.Color;
    visible?: boolean;
} & JSX.IntrinsicElements["mesh"];
export function PlaneHelperMesh({
    width = 1,
    height = 1,
    subPlaneColor = new THREE.Color(0xaaaaaa),
    visible = false,
    ...props
}: planeHelperMeshProps) {
    const meshRef = React.useRef<THREE.Mesh>(new THREE.Mesh());

    return (
        <>
            <mesh
                ref={meshRef}
                visible={visible}
                {...props}
            >
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial
                    color={subPlaneColor}
                    wireframe={true}
                />
            </mesh>
        </>
    );
}

/**
 * Plane Helper Target Mesh
 */
export type planeHelperTargetMeshProps = {
    id: number;
    normal: THREE.Vector3;
    subPlaneSize: number;
    subPlaneColor: THREE.Color;
    visible?: boolean;
    onClick: (e: THREE.Event, id: number) => void;
    setMatrix: (matrix: THREE.Matrix4) => void;
};
export function PlaneHelperTargetMesh({
    id,
    normal,
    subPlaneSize,
    subPlaneColor,
    visible = false,
    onClick,
    setMatrix,
}: planeHelperTargetMeshProps) {
    const planeID = id;
    const groupRef = React.useRef<THREE.Group>(new THREE.Group());
    const [hovered, setHovered] = React.useState(false);
    useCursor(hovered);

    React.useEffect(() => {
        const normal_clone = new THREE.Vector3()
            .copy(normal)
            .multiplyScalar(-1);
        groupRef.current.lookAt(normal_clone);
    }, []);

    return (
        <>
            <group
                ref={groupRef}
                name={`plane${id}`}
                scale={subPlaneSize}
                onClick={(e) => {
                    onClick(e, planeID);
                    setMatrix(groupRef.current.matrixWorld);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                visible={visible}
            >
                <PlaneHelperMesh subPlaneColor={subPlaneColor} />
            </group>
        </>
    );
}
