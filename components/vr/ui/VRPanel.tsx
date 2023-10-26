import React from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { HTMLMesh, InteractiveGroup } from "three-stdlib";
// import { GUI } from "lil-gui";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webxr_vr_sandbox.html
 */
export function VRPanle({ ...props }: JSX.IntrinsicElements["group"]) {
    const parameters = {
        radius: 0.6,
        tube: 0.2,
        tubularSegments: 150,
        radialSegments: 20,
        p: 2,
        q: 3,
        thickness: 0.5,
    };

    const { gl, camera } = useThree();
    const group = React.useMemo(
        () => new InteractiveGroup(gl, camera),
        [gl, camera]
    );

    React.useEffect(() => {
        import("lil-gui").then(({ GUI }) => {
            const gui = new GUI({ width: 300 });
            gui.add(parameters, "radius", 0.0, 1.0);
            gui.add(parameters, "tube", 0.0, 1.0);
            gui.add(parameters, "tubularSegments", 10, 150, 1);
            gui.add(parameters, "radialSegments", 2, 20, 1);
            gui.add(parameters, "p", 1, 10, 1);
            gui.add(parameters, "q", 0, 10, 1);
            gui.add(parameters, "thickness", 0, 1);
            gui.domElement.style.visibility = "hidden";

            // const group = new InteractiveGroup(gl, camera);
            // scene.add(group);

            const mesh = new HTMLMesh(gui.domElement);
            group.add(mesh);
        });
    }, []);

    return (
        <>
            <primitive object={group} {...props} />
        </>
    );
}
