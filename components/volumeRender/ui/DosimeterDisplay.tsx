import React, { useEffect, useRef } from "react";
import { addEffect } from "@react-three/fiber";

import { useStore } from "../../store";
import type { ResultsByName } from "../../../src";

import style from "../../../styles/css/dosimeter.module.css";

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

    const getColor = () => "#00FF00"; // Green

    const getLength = () => `${(100 * (value / maxValue)).toFixed()}%`;

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
            <div class={`${style.dose}`}>
                {/* Name */}
                <div class={`${style.name}`}>
                    {result.displayName ? result.displayName : result.data}
                </div>
                {/* Bar */}
                <div className={`${style.bar}`}>
                    <svg
                        viewBox={"0 0 200 15"}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* back ground */}
                        <path className={`${style.bg}`} d="M0,4 L200,4" />
                        {/* red */}
                        <path className={`${style.red}`} d="M2,4 L198,4" />
                        {/* green */}
                        <path
                            className={`${style.green}`}
                            d="M2,4 L198,4"
                            ref={ref}
                            style={{
                                strokeDashoffset,
                            }}
                        />
                    </svg>
                </div>
                {/* Value */}
                <div class={`${style.value}`}>{value}</div>
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
                    left: "5px",
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
