import React, { useEffect } from "react";
import * as THREE from "three";
import { MeshBVH } from "three-mesh-bvh";
import { useCursor, PivotControls } from "@react-three/drei";
import { useControls, folder, button, Leva } from "leva";

import { VolumeBase, VolumeControls as VolumeControlsImpl } from "../../../src";
import { useStore } from "../../store";

/**
 * Line Helper
 */
type intersectLineHelperProps = {
    index: number;
    clipping: boolean;
    boxSize: [number, number, number];
    basePlanes: THREE.Plane[];
    planes: THREE.Plane[];
    folderName: string;
    renderOrder?: number;
    center?: THREE.Vector3;
    activeAxes?: [boolean, boolean, boolean];
    linewidth?: number;
    color?: THREE.Color;
    onDrag: (
        l: THREE.Matrix4,
        deltaL: THREE.Matrix4,
        w: THREE.Matrix4,
        deltaW: THREE.Matrix4,
        index: number,
        invert: boolean
    ) => void;
    onDragEnd: () => void;
} & JSX.IntrinsicElements["group"];
function IntersectLineHelper({
    index,
    clipping,
    boxSize,
    basePlanes,
    planes,
    folderName,
    renderOrder = 50,
    center = new THREE.Vector3(),
    activeAxes = [true, true, true],
    linewidth = 1,
    color = new THREE.Color(0xccff15),
    onDrag,
    onDragEnd,
    ...props
}: intersectLineHelperProps) {
    const [set, viewing] = useStore((state) => [state.set, state.viewing]);

    const [invert, setInvert] = React.useState<boolean>(false);

    const pivotRef = React.useRef<THREE.Group>(null!);
    const lineSegmentsRef = React.useRef<THREE.LineSegments>(null!);
    const geometryRef = React.useRef<THREE.BufferGeometry>(null!);
    const bvhMesh = React.useMemo(() => {
        // setup BVH Mesh
        const geometry = new THREE.BoxBufferGeometry(...boxSize).translate(
            center.x,
            center.y,
            center.z
        );
        return new MeshBVH(geometry, { maxLeafTris: 3 });
    }, [boxSize, center]);
    const defaultArray = new Float32Array(9999);

    const onDragLine = () => {
        const plane = basePlanes[index];
        const tmpVector3 = new THREE.Vector3();
        const tmpLine3 = new THREE.Line3();

        if (bvhMesh && geometryRef.current && lineSegmentsRef.current) {
            if (geometryRef.current) {
                if (!geometryRef.current.hasAttribute("position")) {
                    const positionAttribute = new THREE.BufferAttribute(
                        defaultArray,
                        3,
                        false
                    );
                    positionAttribute.setUsage(THREE.DynamicDrawUsage);
                    geometryRef.current.setAttribute(
                        "position",
                        positionAttribute
                    );
                }
            }

            let index = 0;
            const positionAttribute = geometryRef.current.attributes.position;

            // code re-used and adjusted from https://gkjohnson.github.io/three-mesh-bvh/example/bundle/clippedEdges.html
            bvhMesh.shapecast({
                intersectsBounds: (box) => {
                    return plane.intersectsBox(box);
                },
                intersectsTriangle: (triangle) => {
                    // check each triangle edge to see if it intersects with the clippingPlane. If so then
                    // add it to the list of segments.
                    let count = 0;
                    tmpLine3.start.copy(triangle.a);
                    tmpLine3.end.copy(triangle.b);
                    if (plane.intersectLine(tmpLine3, tmpVector3)) {
                        positionAttribute.setXYZ(
                            index,
                            tmpVector3.x,
                            tmpVector3.y,
                            tmpVector3.z
                        );
                        index++;
                        count++;
                    }

                    tmpLine3.start.copy(triangle.b);
                    tmpLine3.end.copy(triangle.c);
                    if (plane.intersectLine(tmpLine3, tmpVector3)) {
                        positionAttribute.setXYZ(
                            index,
                            tmpVector3.x,
                            tmpVector3.y,
                            tmpVector3.z
                        );
                        count++;
                        index++;
                    }

                    tmpLine3.start.copy(triangle.c);
                    tmpLine3.end.copy(triangle.a);
                    if (plane.intersectLine(tmpLine3, tmpVector3)) {
                        positionAttribute.setXYZ(
                            index,
                            tmpVector3.x,
                            tmpVector3.y,
                            tmpVector3.z
                        );
                        count++;
                        index++;
                    }

                    // If we only intersected with one or three sides then just remove it. This could be handled
                    // more gracefully.
                    if (count !== 2) {
                        index -= count;
                    }
                },
            });

            // set the draw range to only the new segments and offset the lines so they don't intersect with the geometry
            geometryRef.current.setDrawRange(0, index);
            positionAttribute.needsUpdate = true;
        }
    };

    const [,] = useControls(() => ({
        Data: folder({
            Clip: folder({
                [folderName as string]: folder(
                    {
                        Test: {
                            value: false,
                            label: "invert",
                            onChange: (e) => {
                                setInvert(e);

                                basePlanes[index].normal.multiplyScalar(-1);
                                basePlanes[index].constant *= -1;

                                // set execute log for experiment
                                if (e) {
                                    set((state) => ({
                                        sceneStates: {
                                            ...state.sceneStates,
                                            executeLog: {
                                                ...state.sceneStates.executeLog,
                                                clipping: {
                                                    ...state.sceneStates
                                                        .executeLog.clipping,
                                                    invert: true,
                                                },
                                            },
                                        },
                                    }));
                                }
                            },
                        },
                    },
                    { collapsed: true }
                ),
            }),
        }),
    }));

    useEffect(() => {
        if (clipping) {
            onDragLine();
        }
    });
    useEffect(() => {
        pivotRef.current.matrix.setPosition(center);
    }, [center]);
    useEffect(() => {
        const worldMatrix = pivotRef.current.matrixWorld.clone();
        if (clipping) {
            onDrag(
                new THREE.Matrix4(),
                new THREE.Matrix4(),
                worldMatrix,
                new THREE.Matrix4(),
                index,
                invert
            );
            onDragLine();
        }
    }, [invert]);

    return (
        <>
            <PivotControls
                ref={pivotRef}
                disableAxes={!clipping}
                disableRotations={!clipping}
                disableSliders={!clipping}
                visible={clipping}
                activeAxes={activeAxes}
                onDrag={(l, deltaL, w, deltaW) => {
                    onDrag(l, deltaL, w, deltaW, index, invert);
                    onDragLine();
                }}
            />

            {/* Line */}
            <lineSegments
                ref={lineSegmentsRef}
                frustumCulled={false}
                matrixAutoUpdate={false}
                renderOrder={renderOrder}
                visible={clipping ? !viewing : false}
            >
                <bufferGeometry
                    ref={geometryRef}
                    attach="geometry"
                />
                <lineBasicMaterial
                    attach="material"
                    color={color}
                    linewidth={linewidth}
                    linecap={"round"}
                    linejoin={"round"}
                    polygonOffset={true}
                    polygonOffsetFactor={-1.0}
                    polygonOffsetUnits={4.0}
                    depthTest={false}
                    clippingPlanes={planes}
                />
            </lineSegments>
        </>
    );
}

export type VolumeXYZClippingControlsProps = {
    object: React.RefObject<VolumeBase>;
    planeSize?: number;
    planeColor?: THREE.Color;
    areaSize?: THREE.Vector3Tuple;
    areaScale?: number;
    lineWidth?: number;
    lineColor?: THREE.Color;
};
type ClippingFlag = {
    x: boolean;
    y: boolean;
    z: boolean;
    free: boolean;
};
/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const VolumeXYZClippingControls = React.forwardRef<
    VolumeControlsImpl,
    VolumeXYZClippingControlsProps
>(function VolumeXYZClippingControls(
    {
        object,
        planeSize = 2,
        planeColor = new THREE.Color(0xffff00),
        areaSize = [1, 1, 1],
        areaScale = 1,
        lineWidth = 1,
        lineColor = new THREE.Color(0xccff15),
        ...props
    },
    ref
) {
    const [set, debug, viewing] = useStore((state) => [
        state.set,
        state.debug,
        state.viewing,
    ]);
    const controls = React.useMemo(() => new VolumeControlsImpl(), []);

    const [center, setCenter] = React.useState<THREE.Vector3>(
        new THREE.Vector3()
    );

    // Clipping
    const [clipping, setClipping] = React.useState<boolean>(false);

    const initClippingFlag = {
        x: false,
        y: false,
        z: false,
        free: false,
    };
    const clippingFlagRef = React.useRef<ClippingFlag>(initClippingFlag);
    const [clippingFlag, setClippingFlag] =
        React.useState<ClippingFlag>(initClippingFlag);

    // Plane
    const normals: THREE.Vector3Tuple[] = [
        [1, 0, 0], // X
        [0, 1, 0], // Y
        [0, 0, 1], // Z
        [0, 0, 1], // Free Axis
    ];
    const Normals: THREE.Vector3[] = normals.map((normal) =>
        new THREE.Vector3().fromArray(normal)
    );
    const [basePlanes, setBasePlanes] = React.useState<THREE.Plane[]>(
        Normals.map((n) => new THREE.Plane(n, 0))
    );
    const [Planes, setPlanes] = React.useState<THREE.Plane[]>([]);

    const [boxSize, setBoxSize] = React.useState<[number, number, number]>(
        areaSize.map((value) => value * 2 * areaScale) as [
            number,
            number,
            number,
        ]
    );
    const [lineBasePlanes, setLineBasePlanes] = React.useState<THREE.Plane[]>(
        Normals.map((n) => {
            let normal = n.clone().multiplyScalar(-1);
            return new THREE.Plane(normal, 0);
        })
    );
    const [linePlanes, setLinePlanes] = React.useState<THREE.Plane[]>([]);

    /**
     * leva panels
     */
    // Volume
    const [,] = useControls(() => ({
        Data: folder(
            {
                Clip: folder(
                    {
                        X: folder(
                            {
                                "XOn/Off": {
                                    value: false,
                                    label: "on/off",
                                    onChange: (e) => {
                                        clippingFlagRef.current.x = e;
                                        setClippingFlag({
                                            ...clippingFlagRef.current,
                                        });

                                        // xPivotRef.current.visible = e;

                                        if (e) {
                                            // set execute log for experiment
                                            set((state) => ({
                                                sceneStates: {
                                                    ...state.sceneStates,
                                                    executeLog: {
                                                        ...state.sceneStates
                                                            .executeLog,
                                                        clipping: {
                                                            ...state.sceneStates
                                                                .executeLog
                                                                .clipping,
                                                            x: true,
                                                        },
                                                    },
                                                },
                                            }));
                                        }
                                    },
                                },
                            },
                            { collapsed: true }
                        ),
                        Y: folder(
                            {
                                "YOn/Off": {
                                    value: false,
                                    label: "on/off",
                                    onChange: (e) => {
                                        clippingFlagRef.current.y = e;
                                        setClippingFlag({
                                            ...clippingFlagRef.current,
                                        });

                                        if (e) {
                                            // set execute log for experiment
                                            set((state) => ({
                                                sceneStates: {
                                                    ...state.sceneStates,
                                                    executeLog: {
                                                        ...state.sceneStates
                                                            .executeLog,
                                                        clipping: {
                                                            ...state.sceneStates
                                                                .executeLog
                                                                .clipping,
                                                            y: true,
                                                        },
                                                    },
                                                },
                                            }));
                                        }
                                    },
                                },
                            },
                            { collapsed: true }
                        ),
                        Z: folder(
                            {
                                "ZOn/Off": {
                                    value: false,
                                    label: "on/off",
                                    onChange: (e) => {
                                        clippingFlagRef.current.z = e;
                                        setClippingFlag({
                                            ...clippingFlagRef.current,
                                        });

                                        if (e) {
                                            // set execute log for experiment
                                            set((state) => ({
                                                sceneStates: {
                                                    ...state.sceneStates,
                                                    executeLog: {
                                                        ...state.sceneStates
                                                            .executeLog,
                                                        clipping: {
                                                            ...state.sceneStates
                                                                .executeLog
                                                                .clipping,
                                                            z: true,
                                                        },
                                                    },
                                                },
                                            }));
                                        }
                                    },
                                },
                            },
                            { collapsed: true }
                        ),
                        "Free Axis": folder(
                            {
                                "FreeAxisOn/Off": {
                                    value: false,
                                    label: "on/off",
                                    onChange: (e) => {
                                        setClippingFlag({
                                            ...clippingFlagRef.current,
                                            free: e,
                                        });
                                        clippingFlagRef.current.free = e;

                                        if (e) {
                                            // set execute log for experiment
                                            set((state) => ({
                                                sceneStates: {
                                                    ...state.sceneStates,
                                                    executeLog: {
                                                        ...state.sceneStates
                                                            .executeLog,
                                                        clipping: {
                                                            ...state.sceneStates
                                                                .executeLog
                                                                .clipping,
                                                            free: true,
                                                        },
                                                    },
                                                },
                                            }));
                                        }
                                    },
                                },
                            },
                            { collapsed: true }
                        ),
                    },
                    { order: -1 }
                ),
            },
            { order: 1 }
        ),
    }));

    /**
     *
     */
    const onDrag = (
        l: THREE.Matrix4,
        deltaL: THREE.Matrix4,
        w: THREE.Matrix4,
        deltaW: THREE.Matrix4,
        index: number,
        invert: boolean
    ) => {
        const direction = new THREE.Vector3();
        const position = new THREE.Vector3();

        position.setFromMatrixPosition(w);

        if (index < 3) {
            // X, Y, Z
            direction.fromArray(normals[index]);
        } else {
            // Free
            const e = w.elements;
            direction.set(e[8], e[9], e[10]);
        }

        const coefficient = invert ? 1 : -1;
        direction.normalize().multiplyScalar(coefficient);

        basePlanes[index].normal.copy(direction);
        basePlanes[index].constant = -position.dot(direction);

        const lineDirection = direction.clone().multiplyScalar(-1);
        const offset = direction.clone().multiplyScalar(1e-4);
        const linePosition = position.clone().add(offset);

        lineBasePlanes[index].normal.copy(lineDirection);
        lineBasePlanes[index].constant = -linePosition.dot(lineDirection);
    };

    // Attach volume to controls
    React.useLayoutEffect(() => {
        if (object.current && object.current instanceof VolumeBase) {
            controls.attach(object.current);

            let bbox = new THREE.Box3().setFromObject(object.current);
            let center = new THREE.Vector3();
            bbox.getCenter(center);
            setCenter(center);
        }

        return () => void controls.detach();
    }, [object, controls]);

    React.useEffect(() => {
        basePlanes[0].constant = center.x;
        basePlanes[1].constant = center.y;
        basePlanes[2].constant = center.z;

        basePlanes.forEach((plane, index) => {
            onDrag(
                new THREE.Matrix4(),
                new THREE.Matrix4(),
                new THREE.Matrix4().setPosition(center),
                new THREE.Matrix4(),
                index,
                false
            );
        });
    }, [center, basePlanes]);

    // Push Planes
    React.useEffect(() => {
        controls.clippingPlanes = Planes;
        controls.clipIntersection = true;
    }, [controls, Planes]);

    // Clipping
    React.useEffect(() => {
        const tmpClipping =
            clippingFlag.x ||
            clippingFlag.y ||
            clippingFlag.z ||
            clippingFlag.free;
        controls.clipping = tmpClipping;

        const clippingArray = Object.entries(clippingFlag);
        // @link: https://dev.classmethod.jp/articles/typescript-exclude-ype-removing-undefined/
        const planes: THREE.Plane[] = clippingArray
            .map((value, index) => {
                if (value[1]) {
                    return basePlanes[index];
                } else {
                    return;
                }
            })
            .filter((value): value is NonNullable<typeof value> => {
                return value !== undefined;
            });

        setClipping(tmpClipping);
        setPlanes(planes);

        // Line
        const linePlanes: THREE.Plane[] = clippingArray
            .map((value, index) => {
                if (value[1]) {
                    return lineBasePlanes[index];
                } else {
                    return;
                }
            })
            .filter((value): value is NonNullable<typeof value> => {
                return value !== undefined;
            });

        setLinePlanes(linePlanes);
    }, [controls, clippingFlag, basePlanes, lineBasePlanes]);

    return controls ? (
        <>
            <primitive
                ref={ref}
                object={controls}
            />

            {/* -------------------------------------------------- */}
            {/* Planes */}
            {basePlanes.map((plane, index) => (
                <>
                    <planeHelper
                        plane={plane}
                        size={planeSize}
                        visible={clipping ? debug : false}
                    />
                </>
            ))}

            <group visible={!viewing}>
                {/* X */}
                <IntersectLineHelper
                    index={0}
                    clipping={clippingFlag.x}
                    boxSize={boxSize}
                    basePlanes={basePlanes}
                    planes={linePlanes}
                    folderName="X"
                    center={center}
                    activeAxes={[true, false, false]}
                    linewidth={lineWidth}
                    color={lineColor}
                    onDrag={onDrag}
                    onDragEnd={() => {
                        // set execute log for experiment
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    clipping: {
                                        ...state.sceneStates.executeLog
                                            .clipping,
                                        x: true,
                                    },
                                },
                            },
                        }));
                    }}
                />
                {/* Y */}
                <IntersectLineHelper
                    index={1}
                    clipping={clippingFlag.y}
                    boxSize={boxSize}
                    basePlanes={basePlanes}
                    planes={linePlanes}
                    folderName="Y"
                    center={center}
                    activeAxes={[false, true, false]}
                    linewidth={lineWidth}
                    color={lineColor}
                    onDrag={onDrag}
                    onDragEnd={() => {
                        // set execute log for experiment
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    clipping: {
                                        ...state.sceneStates.executeLog
                                            .clipping,
                                    },
                                    y: true,
                                },
                            },
                        }));
                    }}
                />
                {/* Z */}
                <IntersectLineHelper
                    index={2}
                    clipping={clippingFlag.z}
                    boxSize={boxSize}
                    planes={linePlanes}
                    basePlanes={basePlanes}
                    folderName="Z"
                    center={center}
                    activeAxes={[false, false, true]}
                    linewidth={lineWidth}
                    color={lineColor}
                    onDrag={onDrag}
                    onDragEnd={() => {
                        // set execute log for experiment
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    clipping: {
                                        ...state.sceneStates.executeLog
                                            .clipping,
                                    },
                                    z: true,
                                },
                            },
                        }));
                    }}
                />
                {/* Free */}
                <IntersectLineHelper
                    index={3}
                    clipping={clippingFlag.free}
                    boxSize={boxSize}
                    basePlanes={basePlanes}
                    planes={linePlanes}
                    folderName="Free Axis"
                    center={center}
                    linewidth={lineWidth}
                    color={lineColor}
                    onDrag={onDrag}
                    onDragEnd={() => {
                        // set execute log for experiment
                        set((state) => ({
                            sceneStates: {
                                ...state.sceneStates,
                                executeLog: {
                                    ...state.sceneStates.executeLog,
                                    clipping: {
                                        ...state.sceneStates.executeLog
                                            .clipping,
                                    },
                                    free: true,
                                },
                            },
                        }));
                    }}
                />
            </group>
        </>
    ) : null;
});
