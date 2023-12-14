import React from "react";
import * as THREE from "three";
import { LevaPanel, useControls, useCreateStore } from "leva";

import { useStore } from "../../../components/store";

import style from "../../../styles/css/volumeAnimationControls.module.css";

export type PrototypeAnimationControlsUIProps = {
    audioRef: React.RefObject<HTMLAudioElement>;
    duration: number;
    mode?: string;
    speed?: number;
    customSpeed?: number[];
};
export function PrototypeAnimationControlsUI({
    audioRef,
    duration,
    mode = "time lapse",
    speed = 1.0,
    customSpeed,
    ...props
}: PrototypeAnimationControlsUIProps) {
    const [isTimeLapse] = useStore((state) => [state.sceneStates.isTimeLapse]);

    const speedList = React.useMemo(() => {
        const speedListTmp = [0.25, 0.5, 1.0, 1.5, 2.0];

        return customSpeed ? speedListTmp.concat(customSpeed) : speedListTmp;
    }, [customSpeed]);

    const isPlayRef = React.useRef<boolean>(true);

    const animationStore = useCreateStore();
    const [animation, setAnimation] = useControls(
        () => ({
            play: {
                value: true,
                onChange: (e) => {
                    if (!audioRef.current) {
                        return;
                    }

                    if (e) {
                        audioRef.current.play();
                    } else {
                        audioRef.current.pause();
                    }

                    isPlayRef.current = e;
                },
            },
            speed: {
                value: speed,
                options: speedList,
                onChange: (e) => {
                    audioRef.current
                        ? (audioRef.current.playbackRate = e)
                        : null;
                },
            },
            elapsed: {
                value: 0,
                min: 0,
                max: duration,
                label: "time",
                onChange: (e) => {
                    audioRef.current
                        ? (audioRef.current.currentTime = e)
                        : null;
                },
                onEditStart: () => {
                    audioRef.current ? audioRef.current.pause() : null;
                },
                onEditEnd: () => {
                    if (isPlayRef.current) {
                        audioRef.current ? audioRef.current.play() : null;
                    }
                },
            },
        }),
        { store: animationStore }
    );

    const updateElapsed = () => {
        if (!audioRef.current) {
            return;
        }

        const _elapsed = audioRef.current.currentTime;

        setAnimation({ elapsed: _elapsed });
    };

    React.useEffect(() => {
        setInterval(() => {
            updateElapsed();
        }, 100);
    }, []);

    React.useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        audioRef.current.loop = true;
        // audioRef.current.play();
        /**
         * Need User Interact!, when will play auto.
         * by Google's autoplay-policy
         */
    }, [audioRef]);

    React.useEffect(() => {
        audioRef.current ? audioRef.current.play() : null;
    }, [isTimeLapse]);

    return (
        <div
            className={`${style.foundation} ${
                isTimeLapse && `${style.active}`
            }`}
        >
            <LevaPanel
                fill
                flat
                titleBar={false}
                store={animationStore}
            />
        </div>
    );
}
