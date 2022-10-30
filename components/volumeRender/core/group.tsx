import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import type { objectProps } from "./object";

export type groupProps = {
    children: React.ReactElement | React.ReactElement[];
} & objectProps &
    JSX.IntrinsicElements["group"];
/**
 * @function Group
 * @param children React.ReactElement | React.ReactElement[];
 */
export function Group({ children, ...props }: groupProps) {
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
                plane: props.planes,
                ...child.props,
            })
    );

    return (
        <>
            <group {...props}>
                {/* Children */}
                {cloneChildren}
            </group>
        </>
    );
}
