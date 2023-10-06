/**
 * @link https://codesandbox.io/s/lo6kp?file=/src/ui/Help.tsx
 */
import type { HTMLAttributes } from "react";

import { useStore } from "../../store";

import styles from "../../../styles/css/game.module.css";

const controlOptions = [
    { keys: ["↑", "W"], action: "Forward" },
    { keys: ["←", "A"], action: "Left" },
    { keys: ["↓", "S"], action: "Backward" },
    { keys: ["→", "D"], action: "Right" },
    { keys: ["Space"], action: "Jump" },
    { keys: ["Shift"], action: "Boost" },
    { keys: ["C"], action: "Toggle Camera" },
    { keys: ["Esc"], action: "Menu" },
    // { keys: ["R"], action: "Reset" },
    { keys: ["U"], action: "Toggle Mute" },
    { keys: ["I"], action: "Help" },
    // { keys: ["L"], action: "Leaderboards" },
];

export function Help(): JSX.Element {
    const [set, help, sound] = useStore((state) => [
        state.set,
        state.help,
        state.sound,
    ]);
    return (
        <>
            <div
                className={`${
                    sound ? `${styles.nosound}` : `${styles.nosound}`
                }`}
            ></div>
            <div className={`${styles.help}`}>
                {!help && (
                    <button onClick={() => set({ help: true })}>i</button>
                )}
                <div
                    className={`${styles.popup} ${
                        help ? `${styles.open}` : ""
                    }`}
                >
                    <button
                        className={`${styles["popup-close"]}`}
                        onClick={() => set({ help: false })}
                    >
                        i
                    </button>
                    <div className={`${styles["popup-content"]}`}>
                        <Keys />
                    </div>
                </div>
            </div>
        </>
    );
}

export function Keys(props: HTMLAttributes<HTMLDivElement>): JSX.Element {
    return (
        <div {...props}>
            {controlOptions.map(({ keys, action }) => (
                <div className={`${styles["popup-item"]}`} key={action}>
                    <div>{action}</div>
                    <div className={`${styles["popup-item-keys"]}`}>
                        {keys.map((key) => (
                            <span
                                className={`${styles["popup-item-key"]}`}
                                key={key}
                            >
                                <span>{key}</span>
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
