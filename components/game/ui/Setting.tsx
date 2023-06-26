import { ReactElement, ReactNode, useState } from "react";

import {
    Slider,
    Button,
    Accordion,
    AccordionSummary,
    AccordionActions,
    Divider,
    FormGroup,
    FormControlLabel,
    Grid,
    Stack,
    Switch,
    Typography,
    Input,
} from "@mui/material";
/**
 * Ref
 * @link https://codesandbox.io/s/cc6uqt?file=/demo.tsx
 */

import {
    matcapList,
    debug,
    shadows,
    stats,
    useStore,
    playerConfig,
} from "../store";

function Grid3Row(
    typography: String,
    controls: ReactElement,
    subControls: ReactElement
) {
    return (
        <>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Typography>{typography}</Typography>
                </Grid>
                <Grid item>{controls}</Grid>
                <Grid item>{subControls}</Grid>
            </Grid>
        </>
    );
}

export function Setting() {
    const [value, setValue] = useState<
        number | string | Array<number | string>
    >(30);

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

    return (
        <>
            <div>
                <Button variant="contained">Hello World</Button>
                <Accordion>
                    <AccordionSummary>Performance</AccordionSummary>
                    <AccordionActions>
                        <FormControlLabel
                            label="shadows"
                            labelPlacement="start"
                            control={
                                <Switch
                                    defaultChecked={shadows}
                                    onChange={(event, shadows) =>
                                        set({ shadows })
                                    }
                                />
                            }
                        />
                    </AccordionActions>
                </Accordion>

                <Accordion>
                    <AccordionSummary>Player</AccordionSummary>
                    {/* <Grid3Row
                        typography={"radius"}
                        controls={<Slider />}
                        subControls={<Input />}
                    /> */}
                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        spacing={2}
                    >
                        <Typography>radius</Typography>
                        <Slider />
                        <Input />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        spacing={2}
                    >
                        <Typography>halfHeight</Typography>
                        <Slider />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        spacing={2}
                    >
                        <Typography>moveSpeed</Typography>
                        <Slider />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        spacing={2}
                    >
                        <Typography>boost</Typography>
                        <Slider />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        spacing={2}
                    >
                        <Typography>cameraDistance</Typography>
                        <Slider />
                    </Stack>
                </Accordion>

                <Accordion>
                    <AccordionSummary>Debug</AccordionSummary>

                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        spacing={2}
                    >
                        <Typography>debug</Typography>
                        <Switch
                            defaultChecked={debug}
                            onChange={(event, debug) => set({ debug })}
                        />
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        spacing={2}
                    >
                        <Typography>stats</Typography>
                        <Switch
                            defaultChecked={stats}
                            onChange={(event, stats) => set({ stats })}
                        />
                    </Stack>
                </Accordion>
            </div>
        </>
    );
}
