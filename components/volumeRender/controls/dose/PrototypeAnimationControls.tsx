import React from "react";
import * as THREE from "three";
import { styled, Box, Paper, Stack, Slider, Typography } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";

import { VolumeBase, DoseAnimationObject, VolumeAnimationObject } from "../../../../src";
import { useStore } from "../../../store";

/**
 * @link https://www.youtube.com/watch?v=CH2FmLzWKr4
 * @link https://github.com/mathieumedia/audio-player/blob/master/src/Player.jsx
 */
const CustomPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: "#4c4c4c",
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(6),
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

export type PrototypeAnimationControlsProps = {
    audioSrc: string;
    objects: React.RefObject<VolumeAnimationObject | DoseAnimationObject>[];
    mainGroup: React.RefObject<VolumeBase>;
    subGroup?: React.RefObject<VolumeBase>;
    mode?: string;
    speed?: number;
    customSpeed?: number[];
};
export function PrototypeAnimationControls({
    audioSrc,
    objects,
    mainGroup,
    subGroup,
    mode = "time lapse",
    speed = 1.0,
    customSpeed,
    ...props
}: PrototypeAnimationControlsProps) {
    const audioPlayer = React.useRef<HTMLAudioElement>(null!);

    const [isPlaying, setIsPlaying] = React.useState(false);

    const [elapsed, setElapsed] = React.useState<number>(0);
    const [duration, setDuration] = React.useState<number>(0);

    React.useEffect(() => {
        if (isPlaying) {
            setInterval(() => {
                const _duration = Math.floor(audioPlayer?.current?.duration);
                const _elapsed = Math.floor(audioPlayer?.current?.currentTime);

                setDuration(_duration);
                setElapsed(_elapsed);
            }, 100);
        }
    }, [isPlaying]);

    function formatDuration(value: number) {
        const minute = Math.floor(value / 60);
        const seconds = value - minute * 60;
        return `${minute < 10 ? `0${minute}` : minute}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    const togglePlay = () => {
        if (!isPlaying) {
            audioPlayer.current.play();
        } else {
            audioPlayer.current.pause();
        }
        setIsPlaying((prev) => !prev);
    };

    return (
        <div>
            <audio
                src={audioSrc}
                ref={audioPlayer}
                muted={true}
            />
            <CustomPaper>
                <Box
                    // @ts-ignore
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
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
                                sx={{ color: "lime", "&:hover": { color: "white" } }}
                                onClick={togglePlay}
                            />
                        ) : (
                            <Pause
                                fontSize={"large"}
                                sx={{ color: "lime", "&:hover": { color: "white" } }}
                                onClick={togglePlay}
                            />
                        )}
                    </Stack>

                    <Stack
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    />
                </Box>
                <Stack
                    spacing={1}
                    direction="row"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Typography sx={{ color: "lime" }}>{formatDuration(elapsed)}</Typography>
                    <CustomSlider
                        value={elapsed}
                        max={duration}
                    />
                    <Typography sx={{ color: "lime" }}>
                        {formatDuration(duration - elapsed)}
                    </Typography>
                </Stack>
            </CustomPaper>
        </div>
    );
}
