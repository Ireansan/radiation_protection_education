import { useMemo } from "react";

import { useStore } from "../../../store";
import type { Equipments } from "../../../store";
import type { DoseValue } from "src";

export function calcDose(
    coefficient: number,
    value: {
        dose: DoseValue;
        category: string | undefined;
        coefficient: number | undefined;
    },
    equipments: Equipments
) {
    let guardCoefficient = 1;
    if (value.category) {
        let categoryIndex: number = Object.keys(equipments).indexOf(
            value.category
        );
        let isEquipped: boolean | undefined =
            Object.values(equipments)[categoryIndex];
        let coefficient = value.coefficient ? value.coefficient : 1;

        if (isEquipped) {
            guardCoefficient *= coefficient;
        }
    }

    return 120 * coefficient * (guardCoefficient * value.dose.data);
}

export interface ScenearioConfig {
    distanceMin?: number; // [m]
    distanceMax?: number; // [m]
}
export function useScenario(scenearioConfig: ScenearioConfig) {
    const [set, sceneStates] = useStore((state) => [
        state.set,
        state.sceneStates,
    ]);
    const {
        dosimeterResults,
        playerState,
        doseOrigin,
        dosimeterSettingsState,
    } = sceneStates;
    const { equipments } = playerState;

    const { distanceMin, distanceMax } = scenearioConfig;

    // Distance
    const [distance, inRange] = useMemo(() => {
        const playerPosition = playerState.position.clone().setY(0);
        const origin = doseOrigin.clone().setY(0);

        const distance = origin.distanceTo(playerPosition);
        const inRangeMin = distanceMin ? distanceMin <= distance : true;
        const inRangeMax = distanceMax ? distance <= distanceMax : true;
        return [distance, inRangeMin && inRangeMax];
    }, [playerState, doseOrigin, distanceMin, distanceMax]);

    // Dose values
    const [doseValues, dosimeterResultsLength] = useMemo(() => {
        const doseValues = dosimeterResults.map((value) => {
            const doseValue = value.dose.reduce((acculator, currentValue) =>
                acculator.data > currentValue.data ? acculator : currentValue
            );

            return {
                dose: doseValue,
                state: doseValue.state,
                category: value.category,
                coefficient: value.coefficient,
            };
        });

        return [doseValues, doseValues.length];
    }, [dosimeterResults]);

    // Dose within
    const [yearWithin, onceWithin, allWithin] = useMemo(() => {
        const { N_perYear, N_perPatient, Limit_once } = dosimeterSettingsState;

        const yearWithin: number = doseValues
            .map((value) => {
                return (
                    calcDose(N_perYear * N_perPatient, value, equipments) <
                    20000
                );
            })
            .filter((value) => value === true).length;

        const onceWithin: number = doseValues
            .map((value) => {
                return calcDose(N_perPatient, value, equipments) < Limit_once;
            })
            .filter((value) => value === true).length;

        return [
            yearWithin,
            onceWithin,
            yearWithin === dosimeterResultsLength &&
                onceWithin === dosimeterResultsLength,
        ];
    }, [
        dosimeterSettingsState,
        doseValues,
        dosimeterResultsLength,
        equipments,
    ]);

    // Shield
    const [withinShield, allWithinShield] = useMemo(() => {
        const withinShield: number = doseValues.filter(
            (value) => value.state?.includes("shield")
        ).length;

        return [withinShield, withinShield === doseValues.length];
    }, [doseValues]);

    // Equipments
    const [equipped] = useMemo(() => {
        const equipped: number = Object.values(equipments).filter(
            (value) => value
        ).length;

        return [equipped];
    }, [equipments]);

    return {
        distance: distance,
        inRange: inRange,
        dosimeterResultsLength: dosimeterResultsLength,
        yearWithin: yearWithin,
        onceWithin: onceWithin,
        allWithin: allWithin,
        withinShield: withinShield,
        allWithinShield: allWithinShield,
        equipped: equipped,
    };
}
