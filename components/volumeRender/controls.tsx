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
                clipping: volumeConfig.clipping,
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
