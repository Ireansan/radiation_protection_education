import React from "react";
import * as THREE from "three";
import { extend, ThreeEvent, useFrame } from "@react-three/fiber";
import { useCursor, TransformControls, PivotControls } from "@react-three/drei";
import { useControls, folder, Leva } from "leva";

import { VolumeObject, VolumeGroup } from "./core";
extend({ VolumeObject, VolumeGroup });

import { VolumeControls as VolumeControlsImpl } from "./controls";

type modeType = "translate" | "rotate" | "scale" | undefined;
type spaceType = "world" | "local" | undefined;
type Target = {
    object: THREE.Object3D | undefined;
    id: number;
};

/**
 * Plane Helper Mesh
 */
type planeHelperMeshProps = {
    id: number;
    normal: THREE.Vector3;
    subPlaneSize: number;
    subPlaneColor: THREE.Color;
    visible: boolean;
    onClick: (e: THREE.Event, id: number) => void;
    setMatrix: (matrix: THREE.Matrix4) => void;
};
function PlaneHelperMesh({
    id,
    normal,
    subPlaneSize,
    subPlaneColor,
    visible,
    onClick,
    setMatrix,
}: planeHelperMeshProps) {
    const planeID = id;
    const meshRef = React.useRef<THREE.Mesh>(new THREE.Mesh());
    const [hovered, setHovered] = React.useState(false);
    useCursor(hovered);

    React.useEffect(() => {
        const normal_clone = new THREE.Vector3()
            .copy(normal)
            .multiplyScalar(-1);
        meshRef.current.lookAt(normal_clone);
    }, []);

    return (
        <>
            <mesh
                ref={meshRef}
                name={`plane${id}`}
                scale={subPlaneSize}
                onClick={(e) => {
                    onClick(e, planeID);
                    setMatrix(meshRef.current.matrixWorld);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                visible={visible}
            >
                <planeGeometry />
                <meshBasicMaterial color={subPlaneColor} wireframe={true} />
            </mesh>
        </>
    );
}

/**
 * Point Mesh
 */
type pointMeshProps = {
    id: number;
    pointSize: number;
    pointColor: THREE.Color;
    // visible: boolean;
    onClick: (e: THREE.Event, id: number) => void;
    setMatrix: (matrix: THREE.Matrix4) => void;
};
function PointMesh({
    id,
    pointSize,
    pointColor,
    visible,
    onClick,
    setMatrix,
    ...props
}: pointMeshProps & JSX.IntrinsicElements["mesh"]) {
    const pointID = id;
    const meshRef = React.useRef<THREE.Mesh>(new THREE.Mesh());
    const [hovered, setHovered] = React.useState(false);
    useCursor(hovered);

    React.useEffect(() => {}, []);

    return (
        <>
            <mesh
                ref={meshRef}
                name={`point${id}`}
                scale={pointSize}
                onClick={(e) => {
                    onClick(e, pointID);
                    setMatrix(meshRef.current.matrixWorld);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                visible={visible}
                {...props}
            >
                <boxBufferGeometry />
                <meshBasicMaterial color={pointColor} wireframe={true} />
            </mesh>
        </>
    );
}

/**
 * Controls
 */
type controlsProps = {
    target: Target;
    planes: THREE.Plane[];
    points: THREE.Vector3[];
};
// PivotControls
type pivotControlsProps = {
    matrix: THREE.Matrix4;
    onDragPoint: (position: THREE.Vector3) => void;
} & controlsProps;
function ClippingPlanesPivotControls({
    target,
    planes,
    points,
    matrix,
    onDragPoint,
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

            const patternPlane = /plane.*/;
            const patternPoint = /point.*/;
            if (patternPlane.test(target.object.name)) {
                target.object.getWorldDirection(direction);
                direction.normalize().multiplyScalar(-1);

                planes[target.id].normal.copy(direction);
                planes[target.id].constant = -position.dot(direction);
            } else if (patternPoint.test(target.object.name)) {
                console.log("pivot", position);
                points[target.id].copy(position);
            }
        }
    }

    return (
        <PivotControls
            ref={pivotRef}
            matrix={matrix}
            autoTransform={true}
            onDrag={(l, deltaL, w, deltaW) => {
                onDrag(l, deltaL, w, deltaW);
                onDragPoint(new THREE.Vector3().setFromMatrixPosition(w));
            }}
        />
    );
}

export type VolumeControlsProps = JSX.IntrinsicElements["volumeGroup"] & {
    children?: React.ReactElement<VolumeObject | VolumeGroup>;
    object?:
        | VolumeObject
        | VolumeGroup
        | React.MutableRefObject<VolumeObject>
        | React.MutableRefObject<VolumeGroup>;
    normals?: THREE.Vector3Tuple[];
    planeSize?: number;
    planeColor?: THREE.Color;
    subPlaneSize?: number;
    subPlaneColor?: THREE.Color;
    points?: THREE.Vector3Tuple[];
    pointSize?: number;
    pointColor?: THREE.Color;
};
/**
 * @link https://github.com/pmndrs/drei/blob/master/src/core/TransformControls.tsx
 */
export const VolumeControls = React.forwardRef<
    VolumeControlsProps,
    VolumeControlsProps
>(function VolumeControls(
    {
        children,
        object,
        normals = [],
        planeSize = 100,
        planeColor = new THREE.Color(0xffff00),
        subPlaneSize = 50,
        subPlaneColor = new THREE.Color(0xaaaaaa),
        points = [],
        pointSize = 25,
        pointColor = new THREE.Color(0xffffff),
        ...props
    },
    ref
) {
    const controls = React.useMemo(() => new VolumeControlsImpl(), []);
    const group = React.useRef<VolumeGroup>(null);

    const [matrix, setMatrix] = React.useState<THREE.Matrix4>(
        new THREE.Matrix4()
    );

    const [controlsType, setControlsType] = React.useState<String>();

    // Plane
    const [clipping, setClipping] = React.useState<boolean>(false);
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

    // Point
    const [Points, setPoints] = React.useState<THREE.Vector3[]>(
        points.map((point) => new THREE.Vector3().fromArray(point))
    );

    /**
     * leva panels
     */
    // Volume
    const [volumeConfig, setVolume] = useControls("volume", () => ({
        clim1: {
            value: 0,
            min: 0,
            max: 1,
            onChange: (e) => {
                controls.clim1 = e;
            },
        },
        clim2: {
            value: 1,
            min: 0,
            max: 1,
            onChange: (e) => {
                controls.clim2 = e;
            },
        },
        colormap: {
            value: "viridis",
            options: [
                "parula",
                "heat",
                "jet",
                "turbo",
                "hot",
                "gray",
                "magma",
                "inferno",
                "plasma",
                "viridis",
                "cividis",
                "github",
                "cubehelix",
            ],
            onChange: (e) => {
                controls.colormap = e;
            },
        },
        renderstyle: {
            options: ["mip", "iso"],
            onChange: (e) => {
                controls.renderstyle = e;
                console.log("leva renderstyle", object);
            },
        },
        isothreshold: {
            value: 0.15,
            min: 0,
            max: 1,
            onChange: (e) => {
                controls.isothreshold = e;
            },
        },
        clipping: {
            value: false,
            onChange: (e) => {
                controls.clipping = e;
                setClipping(e);
            },
        },
    }));

    /**
     * Event function
     */
    function onClickPlane(e: THREE.Event, id: number) {
        if (clipping) {
            setTarget({ object: e.object, id: id });
        }
    }
    function onClickPoint(
        e: THREE.Event | ThreeEvent<MouseEvent>,
        id?: number
    ): void {
        setTarget({ object: e.object, id: id ? id : 0 });
        console.log("onClickPoint", typeof target.object);
    }
    function onDragPoint(position: THREE.Vector3) {
        console.log(
            "onDragPoint",
            position,
            controls.object ? controls.object.getVolumeValue(position) : -1
        );
    }

    // Volume
    React.useLayoutEffect(() => {
        if (object) {
            controls.attach(
                object instanceof VolumeObject || object instanceof VolumeGroup
                    ? object
                    : object.current
            );
        } else if (group.current instanceof VolumeGroup) {
            controls.attach(group.current);
        }

        return () => void controls.detach();
    }, [object, children, controls, Planes]);

    // Clipping
    React.useEffect(() => {
        controls.clipping = clipping;
        clipping ? (controls.clippingPlanes = Planes) : null;
    }, [controls, clipping, Planes]);

    // Point
    React.useEffect(() => {
        console.log(1);
    }, [Points]);

    return controls ? (
        <>
            <primitive ref={ref} object={controls} />
            <volumeGroup ref={group}>{children}</volumeGroup>
            {/* Controls */}
            <ClippingPlanesPivotControls
                target={target}
                planes={Planes}
                points={Points}
                matrix={matrix}
                onDragPoint={onDragPoint}
            />
            {/* Clipping Plane */}
            {Planes.map((plane, index) => (
                <>
                    <planeHelper
                        plane={plane}
                        size={planeSize}
                        visible={clipping}
                    />
                    <PlaneHelperMesh
                        id={index}
                        normal={plane.normal}
                        subPlaneSize={subPlaneSize}
                        subPlaneColor={subPlaneColor}
                        visible={clipping}
                        onClick={onClickPlane}
                        setMatrix={setMatrix}
                    />
                </>
            ))}
            {/* Point */}
            {Points.map((point, index) => (
                <>
                    <PointMesh
                        id={index}
                        position={point}
                        pointSize={pointSize}
                        pointColor={pointColor}
                        onClick={onClickPoint}
                        setMatrix={setMatrix}
                    />
                </>
            ))}
        </>
    ) : null;
});
