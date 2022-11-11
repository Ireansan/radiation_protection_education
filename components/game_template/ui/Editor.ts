/**
 * @link https://codesandbox.io/s/racing-game-lo6kp?file=/src/ui/Editor.ts
 */

import { button, folder, useControls } from "leva";

import {
    matcapList,
    debug,
    shadows,
    stats,
    useStore,
    playerConfig,
} from "../store";

const initialValues = {
    shadows,
    ...playerConfig,
    debug,
    stats,
};

export function Editor() {
    const [get, set, debug, shadows, stats] = useStore((state) => [
        state.get,
        state.set,
        state.debug,
        state.shadows,
        state.stats,
    ]);
    const {
        radius,
        halfHeight,
        moveSpeed,
        boost,
        cameraDistance,
        bodyMatcap,
        jointMatcap,
    } = playerConfig;

    const [, setPlayerEditor] = useControls(() => ({
        Performance: folder({
            shadows: {
                value: shadows,
                onChange: (shadows) => set({ shadows }),
            },
        }),
        Player: folder(
            {
                radius: {
                    value: radius,
                    min: 0.1,
                    max: 2,
                    step: 0.01,
                    onChange: (value) =>
                        set({
                            playerConfig: {
                                ...get().playerConfig,
                                radius: value,
                            },
                        }),
                },
                halfHeight: {
                    value: halfHeight,
                    min: -5,
                    max: 5,
                    step: 0.01,
                    onChange: (value) =>
                        set({
                            playerConfig: {
                                ...get().playerConfig,
                                halfHeight: value,
                            },
                        }),
                },
                moveSpeed: {
                    value: moveSpeed,
                    min: 0,
                    max: 10,
                    step: 0.01,
                    onChange: (value) =>
                        set({
                            playerConfig: {
                                ...get().playerConfig,
                                moveSpeed: value,
                            },
                        }),
                },
                boost: {
                    value: boost,
                    min: 0,
                    max: 5,
                    step: 0.01,
                    onChange: (value) =>
                        set({
                            playerConfig: {
                                ...get().playerConfig,
                                boost: value,
                            },
                        }),
                },
                cameraDistance: {
                    value: cameraDistance,
                    min: 1,
                    max: 5,
                    step: 0.01,
                    onChange: (value) =>
                        set({
                            playerConfig: {
                                ...get().playerConfig,
                                cameraDistance: value,
                            },
                        }),
                },
                bodyMatcap: {
                    value: bodyMatcap,
                    options: matcapList,
                    onChange: (value) =>
                    set({
                        playerConfig: {
                            ...get().playerConfig,
                            bodyMatcap: value,
                        },
                    }),
                },
                jointMatcap: {
                    value: jointMatcap,
                    options: matcapList,
                    onChange: (value) =>
                        set({
                            playerConfig: {
                                ...get().playerConfig,
                                jointMatcap: value,
                            },
                        }),
                },
            },
            { collapsed: true }
        ),
        Debug: folder(
            {
                debug: { value: debug, onChange: (debug) => set({ debug }) },
                stats: { value: stats, onChange: (stats) => set({ stats }) },
            },
            { collapsed: true }
        ),
        reset: button(() => {
            // @ts-expect-error -- FIXME: types when using folders seem to be broken"
            setPlayerEditor(initialValues);
        }),
    }));

    return null;
}
