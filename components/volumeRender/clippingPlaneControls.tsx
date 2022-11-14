import React, { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { TransformControls, useCursor } from "@react-three/drei";
import { useControls } from "leva";
import create from "zustand";

import type { objectProps } from "./core";

type modeType = "translate" | "rotate" | "scale" | undefined;
type spaceType = "world" | "local" | undefined;
type Target = {
    object: THREE.Object3D | undefined;
    id: number;
};

/**
 * PlaneHelper & Plane Mesh
 */
type planeHelperMeshProps = {
    id: number;
    normal: THREE.Vector3;
    subsize: number;
    subcolor: THREE.Color;
    setTarget: (target: Target) => void;
};
function PlaneHelperMesh({
    id,
    normal,
    subsize,
    subcolor,
    setTarget,
}: planeHelperMeshProps) {
    const planeID = id;
    const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    // Init
    useEffect(() => {
        const normal_clone = new THREE.Vector3()
            .copy(normal)
            .multiplyScalar(-1);
        meshRef.current.lookAt(normal_clone);
    }, []);

    return (
        <>
            <mesh
                ref={meshRef}
                scale={subsize}
                onClick={(e) => setTarget({ object: e.object, id: planeID })}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <planeGeometry />
                <meshBasicMaterial color={subcolor} wireframe={true} />
            </mesh>
        </>
    );
}

/**
 *
 */
type clippingPlaneControlsProps = {
    children: React.ReactElement | React.ReactElement[];
    normals?: THREE.Vector3Tuple[];
    size?: number;
    color?: THREE.Color;
    subsize?: number;
    subcolor?: THREE.Color;
};
/**
 * @function Controls
 * @param children React.ReactElement | React.ReactElement[];
 * @param normal THREE.Vector3Tuple
 * @param color THREE.Color
 *
 *  <ClippingPlaneControls normals={[0, 0, -1], [0, -1, 0]}>
 *      ....
 *  </ClippingPlaneControls >
 */
export function ClippingPlaneControls({
    children,
    normals = [[0, -1, 0]],
    size = 100,
    color = new THREE.Color(0xffff00),
    subsize = 50,
    subcolor = new THREE.Color(0xaaaaaa),
    ...props
}: clippingPlaneControlsProps & objectProps) {
    const [target, setTarget] = useState<Target>({ object: undefined, id: 0 });

    const Normals: THREE.Vector3[] = normals.map((normal) =>
        new THREE.Vector3().fromArray(normal)
    );
    const [Planes, setPlanes] = useState<THREE.Plane[]>(
        Normals.map((n) => new THREE.Plane(n, 0))
    );
    // TODO: const -> X, not working
    // TODO: useRef -> X, Uncaught TypeError: Cannot read properties of undefined (reading 'normal')
    // TODO: useState -> O, X setPlanes, Uncaught Error: Maximum update depth exceeded.

    const planeConfig = useControls("transform", {
        mode: {
            value: "translate",
            options: ["translate", "rotate"],
        },
        space: {
            value: "world",
            options: ["world", "local"],
        },
    });

    function onObjectChange(e: THREE.Event | undefined) {
        const direction = new THREE.Vector3();
        const position = new THREE.Vector3();

        if (target.object) {
            target.object?.getWorldDirection(direction);
            direction.normalize().multiplyScalar(-1);
            position.copy(target.object.position);

            Planes[target.id].normal.copy(direction);
            Planes[target.id].constant = -position.dot(direction);
        }
    }

    const cloneChildren = React.Children.map(
        children,
        (child: React.ReactElement) =>
            React.cloneElement(child, {
                clim1: props.clim1,
                clim2: props.clim2,
                colormap: props.colormap,
                renderstyle: props.renderstyle,
                isothreshold: props.isothreshold,
                clipping: props.clipping,
                planes: Planes,
                ...child.props,
            })
    );

    return (
        <>
            {console.log("rendering")}
            {/* Children */}
            {cloneChildren}
            {/* Plane Control */}
            <TransformControls
                object={target.object}
                mode={planeConfig.mode as modeType}
                space={planeConfig.space as spaceType}
                onObjectChange={(e) => {
                    onObjectChange(e);
                }}
            />
            {/* PlaneHelpers */}
            {Planes.map((plane, index) => (
                <>
                    <planeHelper plane={plane} size={size} />
                    <PlaneHelperMesh
                        id={index}
                        normal={plane.normal}
                        subsize={subsize}
                        subcolor={subcolor}
                        setTarget={setTarget}
                    />
                </>
            ))}
        </>
    );
}
