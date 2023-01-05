import React from "react";
import * as THREE from "three";
import { extend } from "@react-three/fiber";
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
    subsize: number;
    subcolor: THREE.Color;
    visible: boolean;
    onClick: (e: THREE.Event, id: number) => void;
    setMatrix: (matrix: THREE.Matrix4) => void;
};
function PlaneHelperMesh({
    id,
    normal,
    subsize,
    subcolor,
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
                scale={subsize}
                onClick={(e) => {
                    onClick(e, planeID);
                    setMatrix(meshRef.current.matrixWorld);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                visible={visible}
            >
                <planeGeometry />
                <meshBasicMaterial color={subcolor} wireframe={true} />
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
};
// PivotControls
type pivotControlsProps = {
    matrix: THREE.Matrix4;
} & controlsProps;
function ClippingPlanesPivotControls({
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

            target.object.getWorldDirection(direction);
            direction.normalize().multiplyScalar(-1);
            position.copy(target.object.position);

            planes[target.id].normal.copy(direction);
            planes[target.id].constant = -position.dot(direction);
        }
    }

    return (
        <PivotControls
            ref={pivotRef}
            matrix={matrix}
            autoTransform={true}
            onDrag={(l, deltaL, w, deltaW) => onDrag(l, deltaL, w, deltaW)}
        />
    );
}

// TransformControls
function ClippingPlanesTransformControls({ target, planes }: controlsProps) {
    const [transformControlsConfig, setTransformControlsConfig] = useControls(
        "transform",
        () => ({
            mode: {
                value: "translate",
                options: ["translate", "rotate"],
            },
            space: {
                value: "world",
                options: ["world", "local"],
            },
        })
    );

    function onObjectChange(e: THREE.Event | undefined) {
        const direction = new THREE.Vector3();
        const position = new THREE.Vector3();

        if (target.object) {
            target.object?.getWorldDirection(direction);
            direction.normalize().multiplyScalar(-1);
            position.copy(target.object.position);

            planes[target.id].normal.copy(direction);
            planes[target.id].constant = -position.dot(direction);
        }
    }

    return (
        <TransformControls
            object={target.object}
            mode={transformControlsConfig.mode as modeType}
            space={transformControlsConfig.space as spaceType}
            onObjectChange={(e) => {
                onObjectChange(e);
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
    size?: number;
    color?: THREE.Color;
    subsize?: number;
    subcolor?: THREE.Color;
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
        size = 100,
        color = new THREE.Color(0xffff00),
        subsize = 50,
        subcolor = new THREE.Color(0xaaaaaa),
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
        controlsType: {
            options: ["PivotControls", "TransformControls"],
            onChange: (e) => {
                setControlsType(e);
            },
        },
    }));

    /** */
    function onClick(e: THREE.Event, id: number) {
        setTarget({ object: e.object, id: id });
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

    return controls ? (
        <>
            <primitive ref={ref} object={controls} />
            <volumeGroup ref={group}>{children}</volumeGroup>

            {/* Clipping Plane Controls */}
            {clipping ? (
                controlsType === "PivotControls" ? (
                    <ClippingPlanesPivotControls
                        target={target}
                        planes={Planes}
                        matrix={matrix}
                    />
                ) : (
                    <ClippingPlanesTransformControls
                        target={target}
                        planes={Planes}
                    />
                )
            ) : null}
            {Planes.map((plane, index) => (
                <>
                    <planeHelper plane={plane} size={size} visible={clipping} />
                    <PlaneHelperMesh
                        id={index}
                        normal={plane.normal}
                        subsize={subsize}
                        subcolor={subcolor}
                        visible={clipping}
                        onClick={onClick}
                        setMatrix={setMatrix}
                    />
                </>
            ))}
        </>
    ) : null;
});
