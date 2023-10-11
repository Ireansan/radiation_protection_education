import React, { useEffect } from "react";
import * as THREE from "three";
import { useCursor, PivotControls } from "@react-three/drei";
import { useControls, folder, button, Leva } from "leva";

import { VolumeBase, VolumeControls as VolumeControlsImpl } from "../../../src";
import { useStore } from "../../store";

/**
 * Plane Helper Mesh
 */
type planeHelperMeshProps = {
    id: number;
    subPlaneSize: number;
    subPlaneColor: THREE.Color;
} & JSX.IntrinsicElements["mesh"];
function PlaneHelperMesh({
    id,
    subPlaneSize,
    subPlaneColor,
    ...props
}: planeHelperMeshProps) {
    const meshRef = React.useRef<THREE.Mesh>(new THREE.Mesh());
    const [hovered, setHovered] = React.useState(false);
    useCursor(hovered);

    return (
        <>
            <mesh
                ref={meshRef}
                name={`plane${id}`}
                scale={subPlaneSize}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                // visible={visible}
                {...props}
            >
                <planeGeometry />
                <meshBasicMaterial color={subPlaneColor} wireframe={true} />
            </mesh>
        </>
    );
}

export type VolumeXYZClippingControlsProps = {
    object: React.RefObject<VolumeBase>;
    folderName?: string;
    planeSize?: number;
    planeColor?: THREE.Color;
    subPlaneSize?: number;
    subPlaneColor?: THREE.Color;
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
        folderName = "Clip",
        planeSize = 2,
        planeColor = new THREE.Color(0xffff00),
        subPlaneSize = 1,
        subPlaneColor = new THREE.Color(0xaaaaaa),
        ...props
    },
    ref
) {
    const [debug] = useStore((state) => [state.debug]);
    const controls = React.useMemo(() => new VolumeControlsImpl(), []);

    const xPivotRef = React.useRef<THREE.Group>(null!);
    const yPivotRef = React.useRef<THREE.Group>(null!);
    const zPivotRef = React.useRef<THREE.Group>(null!);
    const freePivotRef = React.useRef<THREE.Group>(null!);

    const [center, setCenter] = React.useState<THREE.Vector3>(
        new THREE.Vector3()
    );

    // Clipping
    const [clipping, setClipping] = React.useState<boolean>(false);

    const initClippingFlag = { x: false, y: false, z: false, free: false };
    const clippingFlagRef = React.useRef<ClippingFlag>(initClippingFlag);
    const [clippingFlag, setClippingFlag] =
        React.useState<ClippingFlag>(initClippingFlag);

    // Plane
    const normals: THREE.Vector3Tuple[] = [
        [1, 0, 0], // X
        [0, 1, 0], // Y
        [0, 0, 1], // Z
        [1, 0, 0], // Free Axis
    ];
    const Normals: THREE.Vector3[] = normals.map((normal) =>
        new THREE.Vector3().fromArray(normal)
    );
    const [tmpPlanes, setTmpPlanes] = React.useState<THREE.Plane[]>(
        Normals.map((n) => new THREE.Plane(n, 0))
    );
    const [Planes, setPlanes] = React.useState<THREE.Plane[]>([]);
    const coefficientsRef = React.useRef<number[]>(new Array(4).fill(-1));

    /**
     * leva panels
     */
    // Volume
    const [,] = useControls(() => ({
        [folderName as string]: folder({
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

                            xPivotRef.current.visible = e;
                        },
                    },
                    XInvert: {
                        value: false,
                        label: "invert",
                        onChange: (e) => {
                            coefficientsRef.current[0] = e ? 1 : -1;

                            tmpPlanes[0].normal.multiplyScalar(-1);
                            tmpPlanes[0].constant *= -1;
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

                            yPivotRef.current.visible = e;
                        },
                    },
                    YInvert: {
                        value: false,
                        label: "invert",
                        onChange: (e) => {
                            coefficientsRef.current[1] = e ? 1 : -1;

                            tmpPlanes[1].normal.multiplyScalar(-1);
                            tmpPlanes[1].constant *= -1;
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

                            zPivotRef.current.visible = e;
                        },
                    },
                    ZInvert: {
                        value: false,
                        label: "invert",
                        onChange: (e) => {
                            coefficientsRef.current[2] = e ? 1 : -1;

                            tmpPlanes[2].normal.multiplyScalar(-1);
                            tmpPlanes[2].constant *= -1;
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

                            freePivotRef.current.visible = e;
                        },
                    },
                    FreeAxisInvert: {
                        value: false,
                        label: "invert",
                        onChange: (e) => {
                            coefficientsRef.current[3] = e ? 1 : -1;

                            tmpPlanes[3].normal.multiplyScalar(-1);
                            tmpPlanes[3].constant *= -1;
                        },
                    },
                },
                { collapsed: true }
            ),
            visible: {
                value: true,
                onChange: (e) => {
                    // setVisible(e);
                },
            },
        }),
    }));

    /**
     *
     */
    const onDrag = (
        l: THREE.Matrix4,
        deltaL: THREE.Matrix4,
        w: THREE.Matrix4,
        deltaW: THREE.Matrix4,
        index: number
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
        direction.normalize().multiplyScalar(coefficientsRef.current[index]);

        tmpPlanes[index].normal.copy(direction);
        tmpPlanes[index].constant = -position.dot(direction);
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

    useEffect(() => {
        xPivotRef.current.matrix.setPosition(center);
        tmpPlanes[0].constant = center.x;

        yPivotRef.current.matrix.setPosition(center);
        tmpPlanes[1].constant = center.y;

        zPivotRef.current.matrix.setPosition(center);
        tmpPlanes[2].constant = center.z;

        freePivotRef.current.matrix.setPosition(center);
    }, [center, tmpPlanes]);

    // Push Planes
    React.useEffect(() => {
        controls.clippingPlanes = Planes;
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
                    return tmpPlanes[index];
                } else {
                    return;
                }
            })
            .filter((value): value is NonNullable<typeof value> => {
                return value !== undefined;
            });

        setClipping(tmpClipping);
        setPlanes(planes);
    }, [controls, clippingFlag, tmpPlanes]);

    return controls ? (
        <>
            <primitive ref={ref} object={controls} />

            {/* -------------------------------------------------- */}
            {/* Planes */}
            {tmpPlanes.map((plane, index) => (
                <>
                    <planeHelper
                        plane={plane}
                        size={planeSize}
                        visible={clipping ? debug : false}
                    />
                </>
            ))}
            {/* X */}
            <PivotControls
                ref={xPivotRef}
                activeAxes={[true, false, false]}
                onDrag={(l, deltaL, w, deltaW) =>
                    onDrag(l, deltaL, w, deltaW, 0)
                }
            >
                <PlaneHelperMesh
                    id={0}
                    subPlaneSize={subPlaneSize}
                    subPlaneColor={subPlaneColor}
                    rotation={[0, Math.PI / 2, 0]}
                />
            </PivotControls>
            {/* Y */}
            <PivotControls
                ref={yPivotRef}
                activeAxes={[false, true, false]}
                onDrag={(l, deltaL, w, deltaW) =>
                    onDrag(l, deltaL, w, deltaW, 1)
                }
            >
                <PlaneHelperMesh
                    id={1}
                    subPlaneSize={subPlaneSize}
                    subPlaneColor={subPlaneColor}
                    rotation={[Math.PI / 2, 0, 0]}
                />
            </PivotControls>
            {/* Z */}
            <PivotControls
                ref={zPivotRef}
                activeAxes={[false, false, true]}
                onDrag={(l, deltaL, w, deltaW) =>
                    onDrag(l, deltaL, w, deltaW, 2)
                }
            >
                <PlaneHelperMesh
                    id={2}
                    subPlaneSize={subPlaneSize}
                    subPlaneColor={subPlaneColor}
                    rotation={[0, 0, Math.PI / 2]}
                />
            </PivotControls>
            {/* Free */}
            <PivotControls
                ref={freePivotRef}
                onDrag={(l, deltaL, w, deltaW) =>
                    onDrag(l, deltaL, w, deltaW, 3)
                }
            >
                <PlaneHelperMesh
                    id={3}
                    subPlaneSize={subPlaneSize}
                    subPlaneColor={subPlaneColor}
                    rotation={[0, 0, Math.PI / 2]}
                />
            </PivotControls>
        </>
    ) : null;
});
