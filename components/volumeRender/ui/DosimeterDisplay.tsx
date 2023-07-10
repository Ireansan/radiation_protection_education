import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
} from "@mui/material";

import { useStore } from "../../store";
import type { ResultsByName } from "../../../src";

type DosimeterResultProps = {
    result: ResultsByName;
};
function DosimeterResult({ result, ...props }: DosimeterResultProps) {
    let value = Math.max(...result.data);

    return (
        <>
            <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
                <TableCell component="th" scope="row">
                    {result.displayName ? result.displayName : result.name}
                </TableCell>
                <TableCell align="left">{value}</TableCell>
            </TableRow>
        </>
    );
}

export function DosimeterDisplayUI({ ...props }) {
    const [sceneProperties] = useStore((state) => [state.sceneProperties]);
    const { dosimeterResults } = sceneProperties;

    return (
        <>
            <div
                id={"DosimeterDisplayUI"}
                style={{
                    position: "absolute",
                    bottom: "5px",
                    left: "50px",
                    // width: "200px",
                }}
            >
                {/* <TableContainer component={Paper}> */}
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Region</TableCell>
                            <TableCell align="left">Dose</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dosimeterResults.map((result, index) => (
                            <DosimeterResult key={index} result={result} />
                        ))}
                    </TableBody>
                </Table>
                {/* </TableContainer> */}
                {/* <h2>{JSON.stringify(dosimeterResults)}</h2> */}
            </div>
        </>
    );
}
