import React from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { useCursor, PivotControls } from "@react-three/drei";
import { useControls, folder, Leva } from "leva";

import {
    VolumeBase,
    VolumeObject,
    VolumeGroup,
    VolumeControls as VolumeControlsImpl,
} from "../core";
extend({ VolumeObject, VolumeGroup });
import type { Target, VolumeControlsTypes } from "./types";

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
            <mesh ref={meshRef} visible={visible} {...props}>
                <planeGeometry args={[width, height]} />
                <meshBasicMaterial color={subPlaneColor} wireframe={true} />
            </mesh>
        </>
    );
}

export type VolumeBoardControlsProps = VolumeControlsTypes & {
    origin: THREE.Vector3 | THREE.Object3D;
    width?: number;
    height?: number;
    folderName?: string;
    planeSize?: number;
    planeColor?: THREE.Color;
    subPlaneSize?: number;
    subPlaneColor?: THREE.Color;
};
/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const VolumeBoardControls = React.forwardRef<
    VolumeBoardControlsProps,
    VolumeBoardControlsProps
>(function VolumeBoardControls(
    {
        children,
        object,
        origin,
        width = 1,
        height = 1,
        folderName = "board",
        planeSize = 2,
        planeColor = new THREE.Color(0xffff00),
        subPlaneSize = 1,
        subPlaneColor = new THREE.Color(0xaaaaaa),
        ...props
    },
    ref
) {
    const controls = React.useMemo(() => new VolumeControlsImpl(), []);
    const group = React.useRef<VolumeGroup>(null);
    const [matrix, setMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4()
    );

    const pivotRef = React.useRef<THREE.Group>(null!);
    const boardRef = React.useRef<THREE.Group>(null!);

    const [visible, setVisible] = React.useState<boolean>(true);

    // -----
    // Plane
    // -----
    const [clipping, setClipping] = React.useState<boolean>(false);
    const [Origin, setOrigin] = React.useState<THREE.Vector3>(
        origin instanceof THREE.Object3D ? origin.position : origin
    );
    // Planes = [Board, Board_top, Board_right, Board_bottom, Board_left]
    const table = [
        { name: "board", index: 0, cross: 0 },
        { name: "top", index: 1, cross: 2 },
        { name: "right", index: 2, cross: 3 },
        { name: "bottom", index: 3, cross: 4 },
        { name: "left", index: 4, cross: 1 },
    ];
    const [Planes, setPlanes] = React.useState<THREE.Plane[]>(
        new Array(5).fill(new THREE.Plane()).map(() => {
            return new THREE.Plane();
        })
    );
    const [Normals, setNormals] = React.useState<THREE.Vector3[]>(
        new Array(5).fill(new THREE.Vector3()).map(() => {
            return new THREE.Vector3();
        })
    );
    const [Positions, setPositions] = React.useState<THREE.Vector3[]>(
        new Array(5).fill(new THREE.Vector3()).map(() => {
            return new THREE.Vector3();
        })
    );

    /**
     * leva panels
     */
    // Volume
    const [volumeConfig, setVolume] = useControls(() => ({
        [folderName as string]: folder({
            clipping: {
                value: false,
                onChange: (e) => {
                    setClipping(e);
                },
            },
            visible: {
                value: true,
                onChange: (e) => {
                    setVisible(e);
                },
            },
        }),
    }));

    /**
     *
     */
    function onDrag(
        l: THREE.Matrix4,
        deltaL: THREE.Matrix4,
        w: THREE.Matrix4,
        deltaW: THREE.Matrix4
    ) {
        const boardDirection = new THREE.Vector3();

        const A = new THREE.Vector3();
        const B = new THREE.Vector3();

        matrix.copy(w);

        if (boardRef.current) {
            var rotationMatrix = new THREE.Matrix4().extractRotation(w);
            boardRef.current.position.setFromMatrixPosition(w);
            boardRef.current.rotation.setFromRotationMatrix(rotationMatrix);

            boardRef.current.getWorldDirection(boardDirection);

            // Record world positions of Board main, top, right, bottom, left
            for (let i = 0; i < table.length; i++) {
                let tmp = table[i];
                let tmpObject = boardRef.current.children.find(
                    (element, index) => element.name === tmp.name
                );

                if (tmpObject) {
                    tmpObject.getWorldPosition(Positions[tmp.index]);
                }
            }

            // Calc each plane normal
            for (let i = 0; i < table.length; i++) {
                let tmp = table[i];

                // Calc Normal
                if (tmp.name === "board") {
                    A.copy(Positions[4]).sub(Positions[0]); // A = P_left - P_board
                    B.copy(Positions[1]).sub(Positions[0]); // B = P_top - P_board
                    Normals[tmp.index].copy(A.cross(B)).normalize(); // A x B
                } else {
                    A.copy(Positions[tmp.index]).sub(Origin); // A = P_i - Origin
                    B.copy(Positions[tmp.cross]).sub(Positions[0]); // B = P_i_cross - P_board
                    Normals[tmp.index].copy(A.cross(B)).normalize(); // A x B
                }

                // check direction
                A.copy(Positions[0]).sub(Origin); // A = P_board - Origin
                B.copy(boardDirection);
                if (A.dot(B) < 0) {
                    Normals[tmp.index].multiplyScalar(-1);
                }

                // Set Plane's normal and constant
                Planes[tmp.index].normal.copy(Normals[tmp.index]);
                Planes[tmp.index].constant = -Positions[tmp.index].dot(
                    Normals[tmp.index]
                );

                // Set direction from Normal
                let tmpTargetPosition = Positions[tmp.index];
                tmpTargetPosition.add(Normals[tmp.index]);
                boardRef.current.children
                    .find((element, index) => element.name === tmp.name)
                    ?.lookAt(tmpTargetPosition);
            }
        }
    }

    /**
     *
     */
    // Attach volume to controls
    React.useLayoutEffect(() => {
        if (object) {
            if (object instanceof VolumeBase) {
                controls.attach(object);
            } else if (object.current instanceof VolumeBase) {
                controls.attach(object.current);
            }
        }

        return () => void controls.detach();
    }, [object, controls]);

    // Push Planes
    React.useEffect(() => {
        controls.clippingPlanes = Planes;
        controls.clipIntersection = true;
    }, [controls, Planes]);

    // Clipping
    React.useEffect(() => {
        controls.clipping = clipping;
    }, [controls, clipping]);

    return controls ? (
        <>
            <primitive ref={ref} object={controls} />

            {/* Main and Helper */}
            <group ref={boardRef}>
                <mesh name="board" visible={visible} position={[0, 0, 0]}>
                    <boxBufferGeometry args={[width, height, 0.05]} />
                    <meshBasicMaterial color={subPlaneColor} wireframe={true} />
                </mesh>
                <PlaneHelperMesh
                    width={width}
                    height={height}
                    name="top"
                    position={[0, height / 2, 0]}
                    visible={visible}
                    subPlaneColor={new THREE.Color(0xaa0000)} // Red
                />
                <PlaneHelperMesh
                    width={height}
                    height={width}
                    name="right"
                    position={[width / 2, 0, 0]}
                    visible={visible}
                    subPlaneColor={new THREE.Color(0x00aa00)} // Green
                />
                <PlaneHelperMesh
                    width={width}
                    height={height}
                    name="bottom"
                    position={[0, -height / 2, 0]}
                    visible={visible}
                    subPlaneColor={new THREE.Color(0x0000aa)} // Blue
                />
                <PlaneHelperMesh
                    width={height}
                    height={width}
                    name="left"
                    position={[-width / 2, 0, 0]}
                    visible={visible}
                    subPlaneColor={new THREE.Color(0xaa00aa)} // Purple
                />
            </group>
            {Planes.map((plane, index) => (
                <>
                    <planeHelper
                        plane={plane}
                        size={planeSize}
                        visible={clipping}
                    />
                </>
            ))}

            {/* PivotControls */}
            <PivotControls
                ref={pivotRef}
                matrix={matrix}
                autoTransform={true}
                scale={50} // FIXME
                onDrag={(l, deltaL, w, deltaW) => {
                    onDrag(l, deltaL, w, deltaW);
                }}
                onDragEnd={() => {
                    console.log(boardRef.current, Planes, Normals, Positions);
                }}
            />
        </>
    ) : null;
});
