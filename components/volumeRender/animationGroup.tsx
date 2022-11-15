import React, { Children, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useControls, folder } from "leva";

import type { objectProps, planesProps } from "./core";

export type animationGroupProps = {
    children: React.ReactElement[];
    i?: number;
} & objectProps &
    planesProps &
    JSX.IntrinsicElements["group"];
/**
 * @function AnitmationGroup
 * @param children React.ReactElement
 */
export function AnimationGroup({ children, ...props }: animationGroupProps) {
    /**
     * Animation Config
     * @return TODO:
     */
    const childrenLength = Children.count(children);
    const seconds = useRef<number>(0);
    const i = useRef<number>(0);
    const [edit, setEdit] = useState<boolean>(false);

    const [animationConfig, setAnimationConfig] = useControls(() => ({
        animation: folder({
            animate: {
                value: true,
            },
            loop: {
                value: true,
            },
            speed: {
                value: 1.0,
                min: 0.25,
                max: 2,
            },
            index: {
                value: 1,
                min: 1,
                max: childrenLength,
                step: 1,
                // FIXME: need custom controller
                onEditStart: (value, path, context) => {
                    setEdit(true);
                },
                onEditEnd: (value, path, context) => {
                    setEdit(false);
                },
            },
        }),
    }));

    /**
     * Main
     */
    const cloneChildren = React.Children.map(
        children,
        (child: React.ReactElement) =>
            React.cloneElement(child, {
                clim1: props.clim1,
                clim2: props.clim2,
                colormap: props.colormap,
                renderstyle: props.renderstyle,
                isothreshold: props.isothreshold,
                clipping: props.clipping || child.props.clipping,
                planes: props.planes,
                ...child.props,
            })
    );

    useFrame((state, delta) => {
        if (edit) {
            i.current = animationConfig.index;
        } else {
            if (animationConfig.animate) {
                var deltaTime: number = animationConfig.speed * delta;
                seconds.current += deltaTime;

                if (seconds.current >= 1) {
                    seconds.current = 0;
                    i.current += 1;

                    if (i.current >= childrenLength) {
                        i.current = 0;
                    }
                    setAnimationConfig({ index: i.current + 1 });
                }
            }
        }
    });

    return (
        <>
            <group {...props}>
                {/* Children */}
                {cloneChildren[i.current]}
            </group>
        </>
    );
}
