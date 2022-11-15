/**
 * @link https://codesandbox.io/s/lo6kp?file=/src/ui/Intro.tsx
 */

import { Suspense, useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

import type { Dispatch, ReactNode, SetStateAction } from "react";

import { useStore } from "../store";
import { Keys } from "./Help";

function Ready({ setReady }: { setReady: Dispatch<SetStateAction<boolean>> }) {
    useEffect(() => () => void setReady(true), []);
    return null;
}

function Loader() {
    const { progress } = useProgress();
    return <div>loading {progress.toFixed()} %</div>;
}

interface IntroProps {
    children: ReactNode;
}

export function Intro({ children }: IntroProps): JSX.Element {
    const [ready, setReady] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [set] = useStore((state) => [state.set]);

    useEffect(() => {
        if (clicked && ready) set({ ready: true });
    }, [ready, clicked]);

    return (
        <>
            <Suspense fallback={<Ready setReady={setReady} />}>
                {children}
            </Suspense>
            <div
                className={`fullscreen bg ${ready ? "ready" : "notready"} ${
                    clicked && "clicked"
                }`}
            >
                <div className="stack">
                    <div className="intro-keys">
                        <Keys style={{ paddingBottom: 20 }} />
                        <a
                            className="continue-link"
                            href="#"
                            onClick={() => ready && setClicked(true)}
                        >
                            {!ready ? <Loader /> : "Click to continue"}
                        </a>
                    </div>
                </div>
                <footer>
                    <a href="https://github.com/pmndrs/react-three-fiber">
                        @react-three/fiber
                    </a>
                    <a href="https://github.com/pmndrs/racing-game">
                        /racing-game
                    </a>
                    <a href="https://codesandbox.io/s/vkgi6">/minecraft</a>
                </footer>
            </div>
        </>
    );
}
