import React from "react";
import * as THREE from "three";
import { ReactThreeFiber, useThree, extend } from "@react-three/fiber";
import { useCursor, TransformControls } from "@react-three/drei";
// import omit from "lodash.omit";
// import pick from "lodash.pick";
import { useControls } from "leva";

import { VolumeObject, VolumeGroup } from "./core";
import { VolumeControls as VolumeControlsImpl } from "./controls";
extend({ VolumeObject, VolumeGroup });

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
    visible: boolean;
};
function PlaneHelperMesh({
    id,
    normal,
    subsize,
    subcolor,
    setTarget,
    visible,
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
                onClick={(e) => setTarget({ object: e.object, id: planeID })}
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

export type VolumeControlsProps = ReactThreeFiber.Object3DNode<
    VolumeControlsImpl,
    typeof VolumeControlsImpl
> &
    JSX.IntrinsicElements["volumeGroup"] & {
        children?: React.ReactElement<VolumeObject>;
        object?: VolumeObject | React.MutableRefObject<VolumeObject>;
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
    // const transformProps = pick(props, transformOnlyPropNames);
    // const objectProps = omit(props, transformOnlyPropNames);

    const controls = React.useMemo(() => new VolumeControlsImpl(), []);
    const group = React.useRef<VolumeGroup>(null);

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

    // leva panel
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
        mode: {
            value: "translate",
            options: ["translate", "rotate"],
        },
        space: {
            value: "world",
            options: ["world", "local"],
        },
    }));

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

    React.useLayoutEffect(() => {
        if (object) {
            controls.attach(
                object instanceof VolumeObject ? object : object.current
            );
            console.log("attach object", object);
        } else if (group.current instanceof VolumeGroup) {
            controls.attach(group.current);
            console.log("attach group.current", group.current);
        }

        console.log(object, controls, group.current instanceof VolumeGroup);

        return () => void controls.detach();
    }, [object, children, controls, Planes]);

    // FIXME:
    React.useEffect(() => {
        controls.clipping = clipping;
        clipping ? (controls.clippingPlanes = Planes) : null;

        console.log(controls, Planes);
    }, [controls, clipping, Planes]);

    return controls ? (
        <>
            <primitive
                ref={ref}
                object={controls}
                //  {...transformProps}
            />
            <volumeGroup
                ref={group}
                // {...objectProps}
            >
                {children}
            </volumeGroup>

            {/* Clipping Plane Controls */}
            {clipping ? (
                <TransformControls
                    object={target.object}
                    mode={volumeConfig.mode as modeType}
                    space={volumeConfig.space as spaceType}
                    onObjectChange={(e) => {
                        onObjectChange(e);
                    }}
                />
            ) : null}
            {Planes.map((plane, index) => (
                <>
                    <planeHelper plane={plane} size={size} visible={clipping} />
                    <PlaneHelperMesh
                        id={index}
                        normal={plane.normal}
                        subsize={subsize}
                        subcolor={subcolor}
                        setTarget={setTarget}
                        visible={clipping}
                    />
                </>
            ))}
        </>
    ) : null;
});
