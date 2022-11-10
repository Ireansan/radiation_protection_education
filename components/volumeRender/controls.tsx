import React, { useState, useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { useControls } from "leva";
import type { TransformControlsProps } from "@react-three/drei";

import type { objectProps } from "./core";

/**
 *
 */
type volumeControlsProps = {
    children: React.ReactElement | React.ReactElement[];
};
/**
 * @function Controls
 * @param children React.ReactElement | React.ReactElement[];
 */
export function VolumeControls({ children }: volumeControlsProps) {
    /**
     * Volume Config
     * @return TODO:
     */
    const volumeConfig = useControls("volume", {
        clim1: {
            value: 0,
            min: 0,
            max: 1,
        },
        clim2: {
            value: 1,
            min: 0,
            max: 1,
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
        },
        renderstyle: {
            options: ["mip", "iso"],
        },
        isothreshold: {
            value: 0.15,
            min: 0,
            max: 1,
        },
        clipping: {
            value: true,
        },
    });

    /**
     * Main
     */
    const cloneChildren = React.Children.map(
        children,
        (child: React.ReactElement) =>
            React.cloneElement(child, {
                clim1: volumeConfig.clim1,
                clim2: volumeConfig.clim2,
                colormap: volumeConfig.colormap,
                renderstyle: volumeConfig.renderstyle,
                isothreshold: volumeConfig.isothreshold,
                clipping: volumeConfig.clipping || child.props.clipping,
                ...child.props,
            })
    );

    return (
        <>
            {/* Children */}
            <Suspense fallback={null}>{cloneChildren}</Suspense>
        </>
    );
}

/**
 *
 */
type clippingPlaneControlsProps = {
    children: React.ReactElement | React.ReactElement[];
    normal?: THREE.Vector3Tuple;
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
 */
/**
 * TODO: Support Multi plane controls
 *  ex.
 *  <ClippingPlaneControls normal={[0, 0, -1]}>
 *      <ClippingPlaneControls normal={[0, -1, 0]}>
 *          ...
 *      </ClippingPlaneControls >
 *  </ClippingPlaneControls >
 *
 *  or
 *
 *  <ClippingPlaneControls normals={[0, 0, -1], [0, -1, 0]}>
 *      ....
 *  </ClippingPlaneControls >
 */
export function ClippingPlaneControls({
    children,
    normal = [0, -1, 0],
    size = 100,
    color = new THREE.Color(0xffff00),
    subsize = 50,
    subcolor = new THREE.Color(0xaaaaaa),
    ...props
}: clippingPlaneControlsProps & objectProps) {
    /**
     * Plane Config
     * (Only support TransformControls)
     * @return TODO:
     */
    const N: THREE.Vector3 = new THREE.Vector3().fromArray(normal);
    const matrix4 = useRef<THREE.Matrix4>(new THREE.Matrix4());
    const [plane, setPlane] = useState<THREE.Plane>(new THREE.Plane(N, 0));
    const planeHelperRef = useRef<THREE.PlaneHelper>(null!);
    const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());
    const lineBasicMaterial = useRef<THREE.LineBasicMaterial>(
        new THREE.LineBasicMaterial()
    );
    const meshBasicMaterial = useRef<THREE.MeshBasicMaterial>(
        new THREE.MeshBasicMaterial()
    );

    type modeType = "translate" | "rotate" | "scale" | undefined;
    type spaceType = "world" | "local" | undefined;

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

    function setConstant(position: THREE.Vector3) {
        const normal_vec: THREE.Vector3 = N.clone();
        normal_vec.transformDirection(matrix4.current);
        const constant: number = -normal_vec.dot(position);

        plane.constant = constant;
        setPlane(plane);
    }

    function setNormal(rotation: THREE.Euler) {
        matrix4.current.makeRotationFromEuler(rotation);

        const normal_vec: THREE.Vector3 = N.clone();
        normal_vec.transformDirection(matrix4.current);

        plane.normal.copy(normal_vec);
        setPlane(plane);
    }

    function onObjectChange(e: THREE.Event | undefined) {
        if (planeConfig.mode === "translate") {
            var position = e?.target.object.position ?? new THREE.Vector3();

            setConstant(position);
            meshRef.current.position.copy(position);
        } else if (planeConfig.mode === "rotate") {
            var rotation = e?.target.object.rotation ?? new THREE.Euler();

            setNormal(rotation);
            meshRef.current.rotation.copy(rotation);
        }
    }

    /**
     * Init
     */
    useEffect(() => {
        // Plane Mesh
        meshRef.current.lookAt(N);

        planeHelperRef.current.size = size;
    }, []);

    const cloneChildren = React.Children.map(
        children,
        (child: React.ReactElement) =>
            React.cloneElement(child, {
                clim1: props.clim1,
                clim2: props.clim2,
                colormap: props.colormap,
                renderstyle: props.renderstyle,
                isothreshold: props.isothreshold,
                clipping: true,
                planes: child.props.planes?.push(plane) ?? [plane],
                ...child.props,
            })
    );

    return (
        <>
            {/* Children */}
            {cloneChildren}
            {/* Plane Control */}
            <TransformControls
                mode={planeConfig.mode as modeType}
                space={planeConfig.space as spaceType}
                onObjectChange={(e) => {
                    onObjectChange(e);
                }}
            />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <planeHelper ref={planeHelperRef} plane={plane} size={size} />
            <mesh ref={meshRef} scale={[subsize, subsize, subsize]}>
                <planeGeometry />
                {/* eslint-disable-next-line react/no-unknown-property */}
                <meshBasicMaterial color={subcolor} wireframe={true} />
            </mesh>
        </>
    );
}

/**
 * Plane Config type 2
 */
/*
    const degreeToRad = (d: number): number => {
        return (Math.PI / 180) * d;
    };
    const planeConfig_2 = useControls("plane", {
        position: {
            value: { x: 0, y: 0, z: 0 },
            onChange: (e) => {
                const position_ = new THREE.Vector3(e.x, e.y, e.z);

                setConstant(position_);
                meshRef.current.position.copy(position_);
            },
            step: 1,
        },
        rotation: {
            value: { x: 0, y: 0, z: 0 },
            onChange: (e) => {
                const rotation_ = new THREE.Euler(
                    degreeToRad(e.x),
                    degreeToRad(e.y),
                    degreeToRad(e.z)
                );

                setNormal(rotation_);
                meshRef.current.rotation.copy(rotation_);
            },
            step: 1,
        },
    });
    */
