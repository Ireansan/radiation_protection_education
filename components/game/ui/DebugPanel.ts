/**
 * @link https://codesandbox.io/s/racing-game-lo6kp?file=/src/ui/Editor.ts
 */

import { folder, useControls } from "leva";

import { useStore } from "../../store";

export function DebugPanel() {
    const [set, debug] = useStore((state) => [state.set, state.debug]);

    const [, setDebug] = useControls(() => ({
        Debug: folder(
            {
                debug: { value: debug, onChange: (debug) => set({ debug }) },
            },
            { order: 1, collapsed: true }
        ),
    }));

    return null;
}
