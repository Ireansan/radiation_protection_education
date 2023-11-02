import React from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { useCursor, PivotControls } from "@react-three/drei";
import {
    RigidBody,
    RigidBodyApi,
    CuboidCollider,
    CuboidArgs,
} from "@react-three/rapier";

import { DoseBase, DoseControls as DoseControlsImpl } from "../../../../src";
import { useStore } from "../../../store";

export type DoseBoardControlsProps = {
    children?: React.ReactElement<THREE.Object3D>;
    object: React.RefObject<DoseBase>;
    origin: THREE.Vector3 | THREE.Object3D;
    areaSize: CuboidArgs;
    width?: number;
    height?: number;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    planeSize?: number;
    planeColor?: THREE.Color;
    scale?: number;
    lineWidth?: number;
    fixed?: boolean;
    offset?: [number, number, number];
    activeAxes?: [boolean, boolean, boolean];
    axisColors?: [string | number, string | number, string | number];
    opacity?: number;
    visible?: boolean;
};
/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const DoseBoardControls = React.forwardRef<
    DoseControlsImpl,
    DoseBoardControlsProps
>(function DoseBoardControls(
    {
        children,
        object,
        origin,
        areaSize = [1, 1, 1],
        width = 1,
        height = 1,
        position = new THREE.Vector3(),
        rotation = new THREE.Euler(),
        planeSize = 2,
        planeColor = new THREE.Color(0xffff00),
        scale = 1,
        lineWidth = 4,
        fixed = false,
        offset = [0, 0, 0],
        activeAxes = [true, true, true],
        axisColors = ["#ff2060", "#20df80", "#2080ff"],
        opacity = 0.5,
        visible = true,
        ...props
    },
    ref
) {
    const [set, debug, viewing] = useStore((state) => [
        state.set,
        state.debug,
        state.viewing,
    ]);
    const controls = React.useMemo(() => new DoseControlsImpl(), []);

    const [_position, setPosition] = React.useState<THREE.Vector3>(position);
    const [_rotation, setRotation] = React.useState<THREE.Euler>(rotation);
    const [matrix, setMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4().compose(
            position,
            new THREE.Quaternion().setFromEuler(rotation),
            new THREE.Vector3(1, 1, 1)
        )
    );

    const pivotRef = React.useRef<THREE.Group>(null!);
    const boardRef = React.useRef<THREE.Group>(null!);
    const helperRef = React.useRef<THREE.Group>(null!);

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

    // -----
    // RigidBody
    // -----
    const rigidBodyRef = React.useRef<RigidBodyApi>(null);
    const [center, setCenter] = React.useState<THREE.Vector3>(
        new THREE.Vector3()
    );

    /**
     *
     */
    function onDrag(
        l: THREE.Matrix4,
        deltaL: THREE.Matrix4,
        w: THREE.Matrix4,
        deltaW: THREE.Matrix4
    ) {
        // update init position, rotation, and matrix
        _position.setFromMatrixPosition(w);
        _rotation.setFromRotationMatrix(w);
        matrix.copy(w);

        // calc board
        const boardDirection = new THREE.Vector3();

        const A = new THREE.Vector3();
        const B = new THREE.Vector3();
        let Positions = new Array<THREE.Vector3>();

        if (boardRef.current) {
            var rotationMatrix = new THREE.Matrix4().extractRotation(w);
            boardRef.current.position.setFromMatrixPosition(w);
            boardRef.current.rotation.setFromRotationMatrix(rotationMatrix);

            boardRef.current.getWorldDirection(boardDirection);
        }

        if (helperRef.current) {
            // Record world positions of Board main, top, right, bottom, left
            Positions = table.map((value, index) => {
                let tmpObject = helperRef.current.getObjectByName(value.name);
                let tmpVector3 = new THREE.Vector3();

                return tmpObject
                    ? tmpVector3.setFromMatrixPosition(tmpObject.matrixWorld)
                    : tmpVector3;
            });

            // Calc each plane normal
            for (let i = 0; i < table.length; i++) {
                let tmp = table[i];

                // Calc Normal
                if (tmp.name === "board") {
                    A.subVectors(Positions[4], Positions[0]); // A = P_left - P_board
                    B.subVectors(Positions[1], Positions[0]); // B = P_top - P_board
                } else {
                    A.subVectors(Positions[tmp.index], Origin); // A = P_i - Origin
                    B.subVectors(Positions[tmp.cross], Positions[0]); // B = P_i_cross - P_board
                }
                Normals[tmp.index].crossVectors(A, B); // A x B
                Normals[tmp.index].normalize();

                // check direction
                A.subVectors(Positions[0], Origin); // A = P_board - Origin
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
                let tmpTargetPosition = Positions[tmp.index].clone();
                tmpTargetPosition.add(Normals[tmp.index]);
                let tmpObject = helperRef.current.getObjectByName(tmp.name);
                tmpObject?.lookAt(tmpTargetPosition);
            }
        }

        if (rigidBodyRef.current) {
            let worldPosition = new THREE.Vector3().setFromMatrixPosition(w);
            let worldRotation = new THREE.Quaternion().setFromRotationMatrix(w);
            rigidBodyRef.current.setRotation(worldRotation);
            rigidBodyRef.current.setTranslation(worldPosition);
        }
    }

    /**
     *
     */
    // Attach volume to controls
    // Object 1
    React.useLayoutEffect(() => {
        if (object.current) {
            if (object.current instanceof DoseBase) {
                controls.attach(object.current);

                let bbox = new THREE.Box3().setFromObject(object.current);
                let center = new THREE.Vector3();
                bbox.getCenter(center);
                setCenter(center);
            }
        }

        return () => void controls.detach();
    }, [object, controls]);

    // Push Planes
    React.useEffect(() => {
        controls.clippingPlanes = Planes;
        controls.clipIntersection = true;

        controls.isType = "board";
    }, [controls, Planes]);

    // Clipping
    React.useEffect(() => {
        controls.clipping = clipping;
        controls.boardEffect = clipping;
    }, [controls, clipping]);

    React.useEffect(() => {
        // set execute log for experiment
        if (clipping) {
            set((state) => ({
                sceneProperties: {
                    ...state.sceneProperties,
                    executeLog: {
                        ...state.sceneProperties.executeLog,
                        shield: {
                            ...state.sceneProperties.executeLog.shield,
                            enabled: true,
                        },
                    },
                },
            }));
        }
    }, [clipping]);

    return controls ? (
        <>
            <primitive ref={ref} object={controls} />

            {/* -------------------------------------------------- */}
            {/* Helper Objects */}
            <group ref={boardRef} position={_position} rotation={_rotation}>
                {/* 3D Object */}
                <group ref={helperRef} visible={clipping ? debug : false}>
                    {/* Main and Helper */}
                    <mesh name="board" position={[0, 0, 0]}>
                        <boxBufferGeometry args={[width, height, 0.05]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0xaaaaaa)}
                            wireframe={true}
                        />
                    </mesh>
                    <mesh name="top" position={[0, height / 2, 0]}>
                        <planeGeometry args={[width, height]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0xaa0000)} // Red
                            wireframe={true}
                        />
                    </mesh>
                    <mesh name="right" position={[width / 2, 0, 0]}>
                        <planeGeometry args={[height, width]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0x00aa00)} // Green
                            wireframe={true}
                        />
                    </mesh>
                    <mesh name="bottom" position={[0, -height / 2, 0]}>
                        <planeGeometry args={[width, height]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0x0000aa)} // Blue
                            wireframe={true}
                        />
                    </mesh>
                    <mesh name="left" position={[-width / 2, 0, 0]}>
                        <planeGeometry args={[height, width]} />
                        <meshBasicMaterial
                            color={new THREE.Color(0xaa00aa)} // Purple
                            wireframe={true}
                        />
                    </mesh>
                </group>
            </group>

            {/* -------------------------------------------------- */}
            {/* Planes */}
            {Planes.map((plane, index) => (
                <>
                    <planeHelper
                        plane={plane}
                        size={planeSize}
                        visible={clipping ? debug : false}
                    />
                </>
            ))}

            {/* -------------------------------------------------- */}
            {/* RigidBody */}
            <RigidBody
                ref={rigidBodyRef}
                colliders={"cuboid"}
                gravityScale={0}
                position={_position}
                rotation={_rotation}
                sensor
            >
                {children}
            </RigidBody>
            <RigidBody colliders={false} gravityScale={0}>
                <CuboidCollider
                    args={areaSize}
                    position={center}
                    sensor
                    onIntersectionEnter={() => {
                        setClipping(true);
                    }}
                    onIntersectionExit={() => {
                        setClipping(false);
                    }}
                />
            </RigidBody>

            {/* -------------------------------------------------- */}
            {/* PivotControls */}
            <PivotControls
                ref={pivotRef}
                matrix={matrix}
                scale={scale}
                lineWidth={lineWidth}
                fixed={fixed}
                offset={offset}
                activeAxes={activeAxes}
                axisColors={axisColors}
                opacity={opacity}
                visible={visible && !viewing}
                onDrag={(l, deltaL, w, deltaW) => {
                    onDrag(l, deltaL, w, deltaW);
                }}
                onDragStart={() => {}}
                onDragEnd={() => {
                    // set execute log for experiment
                    set((state) => ({
                        sceneProperties: {
                            ...state.sceneProperties,
                            executeLog: {
                                ...state.sceneProperties.executeLog,
                                shield: {
                                    ...state.sceneProperties.executeLog.shield,
                                    translate: true,
                                },
                            },
                        },
                    }));
                }}
            />
        </>
    ) : null;
});
