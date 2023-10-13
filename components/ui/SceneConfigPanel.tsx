/**
 * @link https://codesandbox.io/s/racing-game-lo6kp?file=/src/ui/Editor.ts
 */

import { folder, useControls } from "leva";

import { useStore } from "../store";

type SceneConfigPanelProps = {
    activateDebug?: boolean;
    activateViewing?: boolean;
    activateStats?: boolean;
};
export function SceneConfigPanel({
    activateDebug = true,
    activateViewing = true,
    activateStats = true,
}: SceneConfigPanelProps) {
    const [set, debug, viewing, stats] = useStore((state) => [
        state.set,
        state.debug,
        state.viewing,
        state.stats,
    ]);

    const [, setDebug] = useControls(() => ({
        "Scene Config": folder(
            {
                debug: {
                    value: debug,
                    onChange: (debug) => set({ debug }),
                    render: () => {
                        return activateDebug;
                    },
                },
                viewing: {
                    value: viewing,
                    onChange: (viewing) => set({ viewing }),
                    render: () => {
                        return activateViewing;
                    },
                },
                stats: {
                    value: stats,
                    onChange: (stats) => set({ stats }),
                    render: () => {
                        return activateStats;
                    },
                },
            },
            { collapsed: true }
        ),
    }));

    return <></>;
}
