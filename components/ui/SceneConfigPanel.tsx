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
        Scene: folder({
            Gimmick: folder({
                viewing: {
                    value: viewing,
                    onChange: (viewing) => set({ viewing }),
                    render: () => {
                        return activateViewing;
                    },
                },
            }),
            // FIXME: change folder name, "Config" to "Debug"
            Config: folder(
                {
                    debug: {
                        value: debug,
                        onChange: (debug) => set({ debug }),
                        render: () => {
                            return activateDebug;
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
        }),
    }));

    return <></>;
}
