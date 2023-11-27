import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import {
    styled,
    Box,
    Paper,
    Stack,
    Select,
    Slider,
    Typography,
    MenuItem,
} from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";

import style from "../../../styles/css/volumeAnimationControls.module.css";

class TimeData {
    currentTime: number;
    duration: number;

    constructor() {
        this.currentTime = 0;
        this.duration = 0;
    }
}

/**
 * @link https://www.youtube.com/watch?v=CH2FmLzWKr4
 * @link https://github.com/mathieumedia/audio-player/blob/master/src/Player.jsx
 */
const CustomPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: "#4c4c4c",
    padding: theme.spacing(2),
}));
const CustomSlider = styled(Slider)(({ theme, ...props }) => ({
    color: "lime",
    height: 2,
    "&:hover": {
        cursor: "auto",
    },
    "& .MuiSlider-thumb": {
        width: "13px",
        height: "13px",
        display: "none",
    },
}));

export type PrototypeAnimationControlsUIProps = {
    audioRef: React.RefObject<HTMLAudioElement>;
    mode?: string;
    speed?: number;
    customSpeed?: number[];
};
export function PrototypeAnimationControlsUI({
    audioRef,
    mode = "time lapse",
    speed = 1.0,
    customSpeed,
    ...props
}: PrototypeAnimationControlsUIProps) {
    const speedList = React.useMemo(() => {
        const speedListTmp = [0.25, 0.5, 1.0, 1.5, 2.0];

        return customSpeed ? speedListTmp.concat(customSpeed) : speedListTmp;
    }, [customSpeed]);

    const [isPlaying, setIsPlaying] = React.useState(true);
    const [elapsed, setElapsed] = React.useState<number>(0);
    const [duration, setDuration] = React.useState<number>(0);

    const updateElapsed = () => {
        if (!audioRef.current) {
            return;
        }

        const _duration = Math.floor(audioRef.current.duration);
        const _elapsed = audioRef.current.currentTime;

        setDuration(_duration);
        setElapsed(_elapsed);
    };

    const updatePlaybackSpeed = (value: number) => {
        if (!audioRef.current) {
            return;
        }

        audioRef.current.playbackRate = value;
    };

    function formatDuration(value: number) {
        const _value = value < 0 ? 0 : value;

        const minute = Math.floor(_value / 60);
        const seconds = Math.floor(_value - minute * 60);

        return `${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    const togglePlay = () => {
        if (!audioRef.current) {
            return;
        }

        if (!isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }

        setIsPlaying((prev) => !prev);
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
         * FIXME:
         * Need User Interact!, when will play auto.
         * by Google's autoplay-policy
         */
        console.log(audioRef.current.played);
    }, [audioRef]);

    return (
        <div className={`${style.foundation}`}>
            <CustomPaper>
                <Box>
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                            display: "flex",
                            width: "40%",
                            alignItems: "center",
                        }}
                    >
                        {!isPlaying ? (
                            <PlayArrow
                                fontSize={"large"}
                                sx={{
                                    color: "lime",
                                    "&:hover": { color: "white" },
                                }}
                                onClick={togglePlay}
                            />
                        ) : (
                            <Pause
                                fontSize={"large"}
                                sx={{
                                    color: "lime",
                                    "&:hover": { color: "white" },
                                }}
                                onClick={togglePlay}
                            />
                        )}

                        <Select
                            label={"Playback Speed"}
                            defaultValue={1}
                            onChange={(event) =>
                                updatePlaybackSpeed(
                                    event.target.value as number
                                )
                            }
                        >
                            {speedList.map((speed, index) => (
                                <MenuItem
                                    key={index}
                                    value={speed}
                                >
                                    {speed === 1 ? "Normal" : speed}
                                </MenuItem>
                            ))}
                        </Select>
                    </Stack>

                    <Stack
                        spacing={1}
                        direction="row"
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        {/* <Typography sx={{ color: "lime" }}>
                            {formatDuration(elapsed)}
                        </Typography> */}
                        <CustomSlider
                            value={elapsed}
                            max={duration}
                            onChange={(event, value) => {
                                if (!audioRef.current) {
                                    return;
                                }
                                audioRef.current.pause();
                                audioRef.current.currentTime = value as number;

                                updateElapsed();
                            }}
                            onChangeCommitted={() => {
                                if (!audioRef.current) {
                                    return;
                                }
                                isPlaying ? audioRef.current.play() : null;
                            }}
                        />
                        {/* <Typography sx={{ color: "lime" }}>
                            {formatDuration(duration - elapsed)}
                        </Typography> */}
                        <Typography sx={{ color: "lime" }}>
                            {formatDuration(elapsed)}
                        </Typography>
                    </Stack>
                </Box>
            </CustomPaper>
        </div>
    );
}
