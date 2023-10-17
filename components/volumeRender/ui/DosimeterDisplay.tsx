import React, { useEffect, useRef, memo, useMemo } from "react";
import { addEffect } from "@react-three/fiber";
import { useControls, folder, button } from "leva";
import {
    Shield,
    HealthAndSafety,
    SignLanguage,
    HowToReg,
    Person,
    PersonAdd,
    PersonAddAlt1,
    Transcribe,
    Visibility,
    VisibilityOff,
    Sick,
    // BackHand
} from "@mui/icons-material";

import { useStore } from "../../store";
import type { ResultsByName } from "../../../src";

import style from "../../../styles/css/dosimeter.module.css";

/**
 * @link https://codesandbox.io/s/lo6kp?file=/src/ui/Speed/Boost.tsx
 * @link https://codesandbox.io/s/lo6kp?file=/src/styles.css
 */
const strokeDasharray = 200;

type EquipmentProps = {
    goggle: boolean;
    neck: boolean;
    apron: boolean;
    glove: boolean;
};

type ResultIconProps = {
    state: string[];
    color?: string;
};
function ResultIcon({
    state,
    color = "#D4875D", // Orange
    ...props
}: ResultIconProps) {
    return (
        <>
            {state.includes("shield") ? (
                <HealthAndSafety sx={{ color: color, fontSize: "14px" }} />
            ) : null}
            {state.includes("goggle") ? (
                <Visibility sx={{ color: color, fontSize: "14px" }} />
            ) : null}
            {state.includes("neck") ? (
                <PersonAddAlt1 sx={{ color: color, fontSize: "14px" }} />
            ) : null}
            {state.includes("apron") ? (
                <Person sx={{ color: color, fontSize: "14px" }} />
            ) : null}
            {state.includes("glove") ? (
                <SignLanguage sx={{ color: color, fontSize: "14px" }} />
            ) : null}
        </>
    );
}
const MemoResultIcon = memo(ResultIcon);

type ResultDataProps = {
    category: string;
    value: number;
    coefficient: number;
    maxHp: number;
    hpColor?: string;
    damageColor?: string;
    cautionColor?: string;
    bgColor?: string;
};
function ResultData({
    category,
    value,
    coefficient,
    maxHp,
    hpColor = "#56B35D", // Green
    damageColor = "#DEAD29", // Orange
    cautionColor = "#B83100", // Red
    bgColor = "#132237",
    ...props
}: ResultDataProps) {
    const damageRef = useRef<SVGPathElement>(null);
    const hpRef = useRef<SVGPathElement>(null);

    const getColor = () => {
        let hp = maxHp - 120 * coefficient * value;

        return hp < 0 ? cautionColor : damageColor;
    };
    const getLength = () => {
        let offset = (120 * coefficient * value) / maxHp;

        return `${offset > 1.0 ? strokeDasharray : strokeDasharray * offset}`;
    };

    let stroke = getColor();
    let strokeDashoffset = getLength();

    useEffect(() =>
        addEffect(() => {
            if (!damageRef.current) return;

            stroke = getColor();
            if (damageRef.current.style.stroke !== stroke) {
                damageRef.current.style.stroke = stroke;
            }

            if (!hpRef.current) return;

            strokeDashoffset = getLength();
            if (hpRef.current.style.strokeDashoffset !== strokeDashoffset) {
                hpRef.current.style.strokeDashoffset = strokeDashoffset;
            }
        })
    );

    return (
        <>
            <div className={`${style.data}`}>
                {/* Bar */}
                <div className={`${style.bar}`}>
                    <svg
                        className={`${style.svg}`}
                        viewBox={`0 0 200 15`}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* back ground */}
                        <path
                            className={`${style.bg}`}
                            d="M0,4 L200,4"
                            stroke={bgColor}
                            strokeDasharray={206}
                        />
                        {/* Damage Bar */}
                        <path
                            className={`${style.damage}`}
                            d="M2,4 L198,4"
                            ref={damageRef}
                            strokeDasharray={200}
                            style={{ stroke }}
                        />
                        {/* HP Bar */}
                        <path
                            className={`${style.hp}`}
                            d="M2,4 L198,4"
                            ref={hpRef}
                            stroke={hpColor}
                            strokeDasharray={200}
                            style={{
                                strokeDashoffset,
                            }}
                        />
                    </svg>
                </div>
                {/* Value */}
                <div className={`${style.numerical}`}>
                    <div className={`${style.category}`}>{category}</div>
                    <div className={`${style.value}`}>
                        {Math.round(maxHp - 120 * coefficient * value)}
                        <span className={`${style.maxHp}`}>/{maxHp}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
const MemoResultData = memo(ResultData);

type DosimeterResultProps = {
    result: ResultsByName;
    yearCoefficient: number;
    onceMaxHp: number;
    onceCoefficient: number;
    equipmentRef: React.RefObject<EquipmentProps>;
};
function DosimeterResult({
    result,
    yearCoefficient,
    onceMaxHp,
    onceCoefficient,
    equipmentRef,
    ...props
}: DosimeterResultProps) {
    const [value, state] = useMemo(() => {
        // calc vale, state
        let doseValue =
            result.dose.length > 0
                ? result.dose.reduce((acculator, currentValue) =>
                      acculator.data > currentValue.data
                          ? acculator
                          : currentValue
                  )
                : { data: NaN, state: undefined };
        let value = !Number.isNaN(doseValue.data) ? doseValue.data : 0;
        let state = doseValue.state ? doseValue.state : [];

        // check equipment
        if (result.category && equipmentRef.current) {
            let categoryIndex: number = Object.keys(
                equipmentRef.current
            ).indexOf(result.category);
            let isEquipped: boolean | undefined = Object.values(
                equipmentRef.current
            )[categoryIndex];
            let coefficient = result.coefficient ? result.coefficient : 1;

            if (isEquipped) {
                value *= coefficient;
                state.push(result.category);
            }
        }

        return [value, state];
    }, [result, equipmentRef]);

    return (
        <>
            <div className={`${style.dose}`}>
                {/* Name */}
                <div className={`${style.name}`}>
                    <div className={`${style.identifier}`}>
                        {result.displayName ? result.displayName : result.name}
                    </div>
                    <div className={`${style.icon}`}>
                        <MemoResultIcon state={state} />
                    </div>
                </div>
                {/* Datas */}
                <div className={`${style.result}`}>
                    <div className={`${style.year}`}>
                        <MemoResultData
                            category={"Year"}
                            value={value}
                            coefficient={yearCoefficient}
                            maxHp={20000}
                        />
                    </div>
                    <div className={`${style.once}`}>
                        <MemoResultData
                            category={"Once"}
                            value={value}
                            coefficient={onceCoefficient}
                            maxHp={onceMaxHp}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
const MemoDosimeterResult = memo(DosimeterResult);

export function DosimeterDisplayUI({ ...props }) {
    const [set, sceneProperties] = useStore((state) => [
        state.set,
        state.sceneProperties,
    ]);
    const { dosimeterResults } = sceneProperties;

    const equipmentRef = useRef<EquipmentProps>({
        goggle: false,
        neck: false,
        apron: false,
        glove: false,
    });

    /**
     * leva panels
     */
    // Volume
    const [dosimeterConfig, setVolume] = useControls(() => ({
        Dosimeter: folder({
            Equipment: folder({
                Goggle: {
                    value: false,
                    onChange: (e) => {
                        equipmentRef.current.goggle = e;

                        // set execute log for experiment
                        if (e) {
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        dosimeter: {
                                            ...state.sceneProperties.executeLog
                                                .dosimeter,
                                            goggle: true,
                                        },
                                    },
                                },
                            }));
                        }
                    },
                },
                NeckGuard: {
                    value: false,
                    label: "Neck Guard",
                    onChange: (e) => {
                        equipmentRef.current.neck = e;

                        // set execute log for experiment
                        if (e) {
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        dosimeter: {
                                            ...state.sceneProperties.executeLog
                                                .dosimeter,
                                            neckGuard: true,
                                        },
                                    },
                                },
                            }));
                        }
                    },
                },
                Apron: {
                    value: false,
                    onChange: (e) => {
                        equipmentRef.current.apron = e;

                        // set execute log for experiment
                        if (e) {
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        dosimeter: {
                                            ...state.sceneProperties.executeLog
                                                .dosimeter,
                                            apron: true,
                                        },
                                    },
                                },
                            }));
                        }
                    },
                },
                Glove: {
                    value: false,
                    onChange: (e) => {
                        equipmentRef.current.glove = e;

                        // set execute log for experiment
                        if (e) {
                            set((state) => ({
                                sceneProperties: {
                                    ...state.sceneProperties,
                                    executeLog: {
                                        ...state.sceneProperties.executeLog,
                                        dosimeter: {
                                            ...state.sceneProperties.executeLog
                                                .dosimeter,
                                            glove: true,
                                        },
                                    },
                                },
                            }));
                        }
                    },
                },
            }),
            Config: folder(
                {
                    Year: folder({
                        N_year: {
                            value: 500,
                            min: 1,
                            step: 1,
                            label: "N",
                        },
                    }),
                    Once: folder({
                        Limit_once: {
                            value: 100,
                            min: 1,
                            label: "Limit",
                        },
                        N_once: {
                            value: 1,
                            min: 1,
                            step: 1,
                            label: "N",
                        },
                    }),
                },
                { collapsed: true }
            ),
        }),
    }));

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
                    <MemoDosimeterResult
                        key={index}
                        result={result}
                        yearCoefficient={dosimeterConfig.N_year}
                        onceMaxHp={dosimeterConfig.Limit_once}
                        onceCoefficient={dosimeterConfig.N_once}
                        equipmentRef={equipmentRef}
                    />
                ))}
            </div>
        </>
    );
}
