import React from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { useCursor, PivotControls } from "@react-three/drei";
import { useControls, folder, Leva } from "leva";

import {
    VolumeObject,
    VolumeGroup,
    VolumeControls as VolumeControlsImpl,
} from "../../src";
extend({ VolumeObject, VolumeGroup });

import { PlaneHelperMesh } from "./controls";
import type { Target } from "./controls";

/**
 * Controls
 */
type pivotControlsProps = {
    target: Target;
    planes1: THREE.Plane[];
    planes2: THREE.Plane[];
    matrix: THREE.Matrix4;
};
function ClippingPlanesPivotControls({
    target,
    planes1,
    planes2,
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

            planes1[target.id].normal.copy(direction);
            planes1[target.id].constant = -position.dot(direction);

            // FIXME:
            planes2[target.id].normal.copy(direction).multiplyScalar(-1);
            planes2[target.id].constant = position.dot(direction);
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

export type VolumeCompareControlsProps = {
    object1: React.RefObject<VolumeObject> | React.RefObject<VolumeGroup>;
    object2: React.RefObject<VolumeObject> | React.RefObject<VolumeGroup>;
    normals: THREE.Vector3Tuple[];
    folderName?: string;
    planeSize?: number;
    planeColor?: THREE.Color;
    subPlaneSize?: number;
    subPlaneColor?: THREE.Color;
};
/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const VolumeCompareControls = React.forwardRef<
    VolumeCompareControlsProps,
    VolumeCompareControlsProps
>(function VolumeCompareControls(
    {
        object1,
        object2,
        folderName = "comapre",
        normals = [],
        planeSize = 100,
        planeColor = new THREE.Color(0xffff00),
        subPlaneSize = 50,
        subPlaneColor = new THREE.Color(0xaaaaaa),
        ...props
    },
    ref
) {
    const controls1 = React.useMemo(() => new VolumeControlsImpl(), []);
    const controls2 = React.useMemo(() => new VolumeControlsImpl(), []);

    const [matrix, setMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4()
    );

    // Plane
    const [target, setTarget] = React.useState<Target>({
        object: undefined,
        id: 0,
    });

    const Normals: THREE.Vector3[] = normals.map((normal) =>
        new THREE.Vector3().fromArray(normal)
    );
    const [Planes, setPlanes] = React.useState<THREE.Plane[]>(
        Normals.map((n) => new THREE.Plane(n, 0))
    );

    const InvertNormals: THREE.Vector3[] = normals.map((normal) =>
        new THREE.Vector3().fromArray(normal).multiplyScalar(-1)
    );
    const [InvertPlanes, setInvertPlanes] = React.useState<THREE.Plane[]>(
        InvertNormals.map((n) => new THREE.Plane(n, 0))
    );

    /**
     * Event function
     */
    function onClickPlane(e: THREE.Event, id: number) {
        setTarget({ object: e.object, id: id });
    }

    // Attach volume to controls
    // Object 1
    React.useLayoutEffect(() => {
        if (object1.current) {
            if (
                object1.current instanceof VolumeObject ||
                object1.current instanceof VolumeGroup
            ) {
                controls1.attach(object1.current);
            }
        }

        return () => void controls1.detach();
    }, [object1, controls1]);

    // Object 2
    React.useLayoutEffect(() => {
        if (object2) {
            if (
                object2 instanceof VolumeObject ||
                object2 instanceof VolumeGroup
            ) {
                controls2.attach(object2);
            } else if (
                object2.current instanceof VolumeObject ||
                object2.current instanceof VolumeGroup
            ) {
                controls2.attach(object2.current);
            }
        }

        return () => void controls2.detach();
    }, [object2, controls2]);

    // Clipping
    React.useEffect(() => {
        controls1.clipping = true;
        controls1.clippingPlanes = Planes;

        controls2.clipping = true;
        controls2.clippingPlanes = InvertPlanes;
    }, [controls1, Planes, controls2, InvertPlanes]);

    return controls1 && controls2 ? (
        <>
            <primitive ref={ref} object={controls1} />
            <primitive object={controls2} />

            {/* Controls */}
            <ClippingPlanesPivotControls
                target={target}
                planes1={Planes}
                planes2={InvertPlanes}
                matrix={matrix}
            />
            {/* Clipping Plane */}
            {Planes.map((plane, index) => (
                <>
                    <planeHelper
                        plane={plane}
                        size={planeSize}
                        visible={true}
                    />
                    <PlaneHelperMesh
                        id={index}
                        normal={plane.normal}
                        subPlaneSize={subPlaneSize}
                        subPlaneColor={subPlaneColor}
                        visible={true}
                        onClick={(event) => onClickPlane(event, index)}
                        setMatrix={setMatrix}
                    />
                </>
            ))}
            {InvertPlanes.map((invertPlane, index) => (
                <>
                    <planeHelper
                        plane={invertPlane}
                        size={planeSize * 0.9}
                        visible={true}
                    />
                </>
            ))}
        </>
    ) : null;
});
