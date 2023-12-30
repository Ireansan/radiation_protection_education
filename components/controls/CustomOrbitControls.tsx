import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useControls, folder } from "leva";

export type CustomOrbitControlsProps = {
    dampingFactor?: number;
    enableDamping?: boolean;
    panSpeed?: number;
    rotateSpeed?: number;
    zoomSpeed?: number;
    enablePan?: boolean;
    enableRotate?: boolean;
    enableZoom?: boolean;
};
export function CustomOrbitControls({
    dampingFactor = 0.05,
    enableDamping = false,
    panSpeed = 1.0,
    rotateSpeed = 1.0,
    zoomSpeed = 1.0,
    enablePan = true,
    enableRotate = true,
    enableZoom = true,
    ...props
}: CustomOrbitControlsProps) {
    const ref = React.useRef<OrbitControlsImpl>(null!);

    const [,] = useControls(() => ({
        Scene: folder({
            Options: folder({
                "Camera Controls Settings": folder(
                    {
                        dampingFactor: {
                            value: dampingFactor,
                            min: 0.01,
                            max: 1,
                            step: 0.01,
                            onChange: (e) => {
                                ref.current.dampingFactor = e;
                            },
                        },
                        enableDamping: {
                            value: enableDamping,
                            onChange: (e) => {
                                ref.current.enableDamping = e;
                            },
                        },
                        panSpeed: {
                            value: panSpeed,
                            min: 0.05,
                            max: 2,
                            step: 0.05,
                            onChange: (e) => {
                                ref.current.panSpeed = e;
                            },
                        },
                        rotateSpeed: {
                            value: rotateSpeed,
                            min: 0.05,
                            max: 2,
                            step: 0.05,
                            onChange: (e) => {
                                ref.current.rotateSpeed = e;
                            },
                        },
                        zoomSpeed: {
                            value: zoomSpeed,
                            min: 0.05,
                            max: 2,
                            step: 0.05,
                            onChange: (e) => {
                                ref.current.zoomSpeed = e;
                            },
                        },
                    },
                    { order: -2, collapsed: true }
                ),
                Debug: folder(
                    {
                        "Camera Controls Settings": folder(
                            {
                                enablePan: {
                                    value: enablePan,
                                    onChange: (e) => {
                                        ref.current.enablePan = e;
                                    },
                                },
                                enableRotate: {
                                    value: enableRotate,
                                    onChange: (e) => {
                                        ref.current.enableRotate = e;
                                    },
                                },
                                enableZoom: {
                                    value: enableZoom,
                                    onChange: (e) => {
                                        ref.current.enableZoom = e;
                                    },
                                },
                            },
                            { collapsed: true }
                        ),
                    },
                    { collapsed: true }
                ),
            }),
        }),
    }));

    return (
        <>
            <OrbitControls
                ref={ref}
                makeDefault
            />
        </>
    );
}
