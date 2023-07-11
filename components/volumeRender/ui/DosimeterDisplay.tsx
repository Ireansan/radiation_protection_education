import React, { useEffect, useRef } from "react";
import { addEffect } from "@react-three/fiber";

import { useStore } from "../../store";
import type { ResultsByName } from "../../../src";

/**
 * @link https://codesandbox.io/s/lo6kp?file=/src/ui/Speed/Boost.tsx
 * @link https://codesandbox.io/s/lo6kp?file=/src/styles.css
 */

const criticalLevel = 5;
const warningLevel = 10;
const maxValue = 15;

type DosimeterResultProps = {
    result: ResultsByName;
};
function DosimeterResult({ result, ...props }: DosimeterResultProps) {
    let value = Math.max(...result.data);

    const ref = useRef<SVGPathElement>(null);

    const getColor = () =>
        value < criticalLevel
            ? "#00FF00" // Green
            : value < warningLevel
            ? "#FFE600" // Yellow
            : "#FF0000"; // Red
    const getLength = () => `${(100 * (1 - value / maxValue)).toFixed()}%`;

    let stroke = getColor();
    let strokeDashoffset = getLength();

    useEffect(() =>
        addEffect(() => {
            if (!ref.current) return;

            stroke = getColor();
            if (ref.current.style.stroke !== stroke) {
                ref.current.style.stroke = stroke;
            }

            strokeDashoffset = getLength();
            if (ref.current.style.strokeDashoffset !== strokeDashoffset) {
                ref.current.style.strokeDashoffset = strokeDashoffset;
            }
        })
    );

    return (
        <>
            <div className="bar" style={{ position: "relative", top: "15px" }}>
                <svg
                    width={289}
                    height={55}
                    viewBox="0 0 289 55"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        className="bg-path"
                        d="M13,12 L200,12"
                        style={{
                            stroke: "#132237",
                            "stroke-width": "13px",
                            "stroke-dasharray": "295px",
                        }}
                    />
                    <path
                        className="path"
                        d="M15,12 L198,12"
                        ref={ref}
                        style={{
                            "stroke-width": "9px",
                            "stroke-dasharray": "100%",
                            stroke,
                            strokeDashoffset,
                        }}
                    />
                    <text className="boost-text" x="0">
                        <tspan>テスト</tspan>
                    </text>
                </svg>
            </div>
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
                {dosimeterResults.map((result, index) => (
                    <DosimeterResult key={index} result={result} />
                ))}
            </div>
        </>
    );
}
