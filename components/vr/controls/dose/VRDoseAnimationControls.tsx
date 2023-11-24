import React from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { HTMLMesh, InteractiveGroup } from "three-stdlib";

import {
    VolumeBase,
    DoseAnimationObject,
    VolumeAnimationObject,
} from "../../../../src";
import type { DoseAnimationControlsProps } from "../../../volumeRender";
import { useStore } from "../../../store";

export function VRDoseAnimationControls({
    objects,
    mainGroup,
    subGroup,
    duration,
    mode = "time lapse",
    speed = 1.0,
    customSpeed,
    ...props
}: DoseAnimationControlsProps & JSX.IntrinsicElements["group"]) {
    const modeList = ["time lapse", "accumulate"];
    let speedListTmp = [0.25, 0.5, 1.0, 1.5, 2.0];
    const speedList = customSpeed
        ? speedListTmp.concat(customSpeed)
        : speedListTmp;
    // const maxSpeed = speedList.reduce((a, b) => Math.max(a, b));
    const parameters = {
        mode: modeList.indexOf(mode),
        play: 1,
        speed: speedList.indexOf(speed),
    };

    const [set] = useStore((state) => [state.set]);

    const childMaxLength = React.useRef<{
        index: number;
        length: number;
    }>({
        index: 0,
        length: 1,
    });

    /**
     * @link https://github.com/pmndrs/drei/blob/cce70ae77b5151601089114259fbffab8747c8fa/src/core/useAnimations.tsx
     */
    const [mixer] = React.useState<THREE.AnimationMixer[]>(
        objects.map(
            (object, i) =>
                new THREE.AnimationMixer(
                    undefined as unknown as THREE.Object3D,
                ),
        ),
    );
    const [actions, setActions] = React.useState(() => {
        const actions = objects.map((object, i) => {
            return {};
        }) as {
            [key in THREE.AnimationClip["name"]]: THREE.AnimationAction | null;
        }[];

        return actions;
    });
    const lazyActions = React.useRef<
        {
            [key: string]: THREE.AnimationAction | null;
        }[]
    >(
        objects.map((object, i) => {
            return {};
        }),
    );

    React.useEffect(() => {
        objects.forEach((object, i) => {
            if (object.current) {
                object.current.animations.forEach((clip) => {
                    lazyActions.current[i][clip.name] = mixer[i].clipAction(
                        clip,
                        object.current!,
                    );

                    if (childMaxLength.current.length <= clip.duration) {
                        childMaxLength.current = {
                            index: i,
                            length: clip.duration,
                        };
                    }
                });
            }
        });
        setActions(lazyActions.current);

        actions.forEach(
            (actions) => actions["volumeAnimation"]?.reset().play(),
        );
    }, [objects]);

    React.useEffect(() => {
        actions.forEach(
            (actions) => actions["volumeAnimation"]?.reset().play(),
        );
    }, [actions]);

    const edit = React.useRef<boolean>(false);
    const speedRef = React.useRef<number>(speed);
    const timeRef = React.useRef<{ time: number }>({ time: 0 });

    const { gl, camera } = useThree();
    const group = React.useMemo(
        () => new InteractiveGroup(gl, camera),
        [gl, camera],
    );

    /**
     * lil-gui
     */
    React.useEffect(() => {
        import("lil-gui").then(({ GUI }) => {
            const gui = new GUI({ width: 300 });
            gui.add(parameters, "mode")
                .min(0)
                .max(1)
                .step(1)
                .name("mode (Type)")
                .onChange((i: number) => {
                    const e: string = modeList[i];

                    if (e === "time lapse") {
                        mainGroup.current
                            ? (mainGroup.current.visible = true)
                            : null;

                        if (subGroup) {
                            subGroup.current
                                ? (subGroup.current.visible = false)
                                : null;
                        }
                    } else if (e === "accumulate") {
                        mainGroup.current
                            ? (mainGroup.current.visible = false)
                            : null;

                        if (subGroup) {
                            subGroup.current
                                ? (subGroup.current.visible = true)
                                : null;
                        }
                    } else {
                        console.log("test");
                    }

                    // set execute log for experiment
                    switch (e) {
                        case "time lapse":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        animation: {
                                            ...state.sceneProperties.executeLog
                                                .animation,
                                            timeLapse: true,
                                        },
                                    },
                                },
                            }));
                            break;
                        case "accumulate":
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        animation: {
                                            ...state.sceneProperties.executeLog
                                                .animation,
                                            accumulate: true,
                                        },
                                    },
                                },
                            }));
                            break;
                    }
                });

            const folder = gui.addFolder("Animation");
            folder
                .add(parameters, "play")
                .min(0)
                .max(1)
                .step(1)
                .name("play (on/off)")
                .onChange((n: number) => {
                    const e: boolean = n ? true : false;

                    lazyActions.current.forEach((actions) => {
                        actions["volumeAnimation"]
                            ? (actions["volumeAnimation"].paused = !e)
                            : null;
                    });
                });
            folder
                .add(parameters, "speed")
                .min(0.25)
                // .max(maxSpeed)
                // .step(0.25)
                .max(speedList.length - 1)
                .step(1)
                .name("speed (Type)")
                .onChange((n: number) => {
                    const e: number = speedList[n];
                    speedRef.current = e;
                });
            folder
                .add(timeRef.current, "time")
                .min(0)
                .max(duration)
                .step(1)
                .onChange((e: number) => {
                    edit.current = true;
                    timeRef.current.time = e;
                })
                .onFinishChange(() => {
                    edit.current = false;
                })
                .listen()
                .disable();

            gui.domElement.style.visibility = "hidden";

            // const group = new InteractiveGroup(gl, camera);
            // scene.add(group);

            const mesh = new HTMLMesh(gui.domElement);
            group.add(mesh);
        });
    }, []);

    useFrame((state, delta) => {
        if (mainGroup.current?.visible) {
            if (edit.current) {
                actions.forEach((actions, i) => {
                    actions["volumeAnimation"]
                        ? (actions["volumeAnimation"].time =
                              timeRef.current.time)
                        : null;
                });
                mixer.forEach((mixer, i) => {
                    mixer.update(0);
                });
            } else {
                mixer.forEach((mixer) => {
                    mixer.update(delta * speedRef.current);
                });
            }

            let actionsMaxLength = actions[childMaxLength.current.index];
            if (actionsMaxLength["volumeAnimation"]) {
                actionsMaxLength["volumeAnimation"].time !==
                    timeRef.current.time &&
                actionsMaxLength["volumeAnimation"].time < duration
                    ? (timeRef.current.time = Math.floor(
                          actionsMaxLength["volumeAnimation"].time,
                      ))
                    : null;
            }

            if (objects) {
                objects.forEach((object) => {
                    if (object.current) {
                        object.current.index = Math.floor(timeRef.current.time);
                    }
                });
            }
        } else {
        }
    });

    return (
        <>
            {/* {console.log("animation rendering")} */}
            {/* {console.log("animation", childMaxLength, mixer)} */}
            <primitive object={group} {...props} />
        </>
    );
}
