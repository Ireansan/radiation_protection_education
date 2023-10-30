import React from "react";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

import { useStore } from "../store";

import { googleFormsURL } from "utils/common/experimentsConfig";

import styles from "../../styles/css/experimentCheckList.module.css";

type experimentCheckListProps = {};
export function ExperimentCheckList({ ...props }: experimentCheckListProps) {
    const [
        Animation,
        Colormap,
        RenderStyle,
        Clipping,
        Avatar,
        Shield,
        Dosimeter,
    ] = useStore((state) => [
        state.sceneProperties.executeLog.animation,
        state.sceneProperties.executeLog.parameter.colormap,
        state.sceneProperties.executeLog.parameter.renderStyle,
        state.sceneProperties.executeLog.clipping,
        state.sceneProperties.executeLog.avatar,
        state.sceneProperties.executeLog.shield,
        state.sceneProperties.executeLog.dosimeter,
    ]);

    const color = "#65BF74";

    const dosimeter = [
        Dosimeter.goggle,
        Dosimeter.neckGuard,
        Dosimeter.apron,
        Dosimeter.glove,
    ];
    const animation = [Animation.timeLapse, Animation.accumulate];
    const colormap = [
        Colormap.parula,
        Colormap.heat,
        Colormap.jet,
        Colormap.turbo,
        Colormap.hot,
        Colormap.gray,
        Colormap.magma,
        Colormap.inferno,
        Colormap.plasma,
        Colormap.viridis,
        Colormap.cividis,
        Colormap.github,
        Colormap.cubehelix,
    ];
    const renderStyle = [RenderStyle.mip, RenderStyle.iso];
    const clipping = [Clipping.x, Clipping.y, Clipping.z, Clipping.free];
    const clippingInvert = [Clipping.invert];
    const avatar = [Avatar.translate, Avatar.leftHand, Avatar.rightHand];
    const shield = [Shield.translate, Shield.enabled];

    const total = [
        ...dosimeter,
        ...animation,
        ...colormap,
        ...renderStyle,
        ...clipping,
        ...clippingInvert,
        ...avatar,
        ...shield,
    ];

    const dosimeterResult = dosimeter.reduce(
        (previous, current) => previous && current
    );
    const animationResult = animation.reduce(
        (previous, current) => previous && current
    );
    const colormapResult = colormap.reduce(
        (previous, current) => previous && current
    );
    const renderStyleResult = renderStyle.reduce(
        (previous, current) => previous && current
    );
    const clippingResult = clipping.reduce(
        (previous, current) => previous && current
    );
    const clippingInvertResult = clippingInvert.reduce(
        (previous, current) => previous && current
    );
    const avatarResult = avatar.reduce(
        (previous, current) => previous && current
    );
    const shieldResult = shield.reduce(
        (previous, current) => previous && current
    );

    return (
        <>
            <div className={`${styles.experiment}`}>
                <h2>Exepriment Check List</h2>
                <div className={`${styles.items}`}>
                    {/* Equipments */}
                    <div className={`${styles.item}`}>
                        <div className={`${styles.check}`}>
                            {dosimeterResult ? (
                                <CheckBox
                                    sx={{ color: color, fontSize: "0.8rem" }}
                                />
                            ) : (
                                <CheckBoxOutlineBlank
                                    sx={{ fontSize: "0.8rem" }}
                                />
                            )}
                        </div>
                        <div
                            className={`${styles.content} ${
                                dosimeterResult && `${styles.done}`
                            }`}
                        >
                            equipments &nbsp;
                            {dosimeter.filter((v) => v === true).length}/
                            {dosimeter.length}
                        </div>
                    </div>
                    {/* data mode */}
                    <div className={`${styles.item}`}>
                        <div className={`${styles.check}`}>
                            {animationResult ? (
                                <CheckBox
                                    sx={{ color: color, fontSize: "0.8rem" }}
                                />
                            ) : (
                                <CheckBoxOutlineBlank
                                    sx={{ fontSize: "0.8rem" }}
                                />
                            )}
                        </div>
                        <div
                            className={`${styles.content} ${
                                animationResult && `${styles.done}`
                            }`}
                        >
                            data mode &nbsp;
                            {animation.filter((v) => v === true).length}/
                            {animation.length}
                        </div>
                    </div>
                    {/* color map */}
                    <div className={`${styles.item}`}>
                        <div className={`${styles.check}`}>
                            {colormapResult ? (
                                <CheckBox
                                    sx={{ color: color, fontSize: "0.8rem" }}
                                />
                            ) : (
                                <CheckBoxOutlineBlank
                                    sx={{ fontSize: "0.8rem" }}
                                />
                            )}
                        </div>
                        <div
                            className={`${styles.content} ${
                                colormapResult && `${styles.done}`
                            }`}
                        >
                            colormap &nbsp;
                            {colormap.filter((v) => v === true).length}/
                            {colormap.length}
                        </div>
                    </div>
                    {/* render style */}
                    <div className={`${styles.item}`}>
                        <div className={`${styles.check}`}>
                            {renderStyleResult ? (
                                <CheckBox
                                    sx={{ color: color, fontSize: "0.8rem" }}
                                />
                            ) : (
                                <CheckBoxOutlineBlank
                                    sx={{ fontSize: "0.8rem" }}
                                />
                            )}
                        </div>
                        <div
                            className={`${styles.content} ${
                                renderStyleResult && `${styles.done}`
                            }`}
                        >
                            render style &nbsp;
                            {renderStyle.filter((v) => v === true).length}/
                            {renderStyle.length}
                        </div>
                    </div>
                    {/* Clip */}
                    <div className={`${styles.item}`}>
                        <div className={`${styles.check}`}>
                            {clippingResult ? (
                                <CheckBox
                                    sx={{ color: color, fontSize: "0.8rem" }}
                                />
                            ) : (
                                <CheckBoxOutlineBlank
                                    sx={{ fontSize: "0.8rem" }}
                                />
                            )}
                        </div>
                        <div
                            className={`${styles.content} ${
                                clippingResult && `${styles.done}`
                            }`}
                        >
                            clip x, y, z, free axis &nbsp;
                            {clipping.filter((v) => v === true).length}/
                            {clipping.length}
                        </div>
                    </div>
                    <div className={`${styles.item}`}>
                        <div className={`${styles.check}`}>
                            {clippingInvertResult ? (
                                <CheckBox
                                    sx={{ color: color, fontSize: "0.8rem" }}
                                />
                            ) : (
                                <CheckBoxOutlineBlank
                                    sx={{ fontSize: "0.8rem" }}
                                />
                            )}
                        </div>
                        <div
                            className={`${styles.content} ${
                                clippingInvertResult && `${styles.done}`
                            }`}
                        >
                            clip invert &nbsp;
                            {clippingInvert.filter((v) => v === true).length}/
                            {clippingInvert.length}
                        </div>
                    </div>
                    {/* Player (Avatar) */}
                    <div className={`${styles.item}`}>
                        <div className={`${styles.check}`}>
                            {avatarResult ? (
                                <CheckBox
                                    sx={{ color: color, fontSize: "0.8rem" }}
                                />
                            ) : (
                                <CheckBoxOutlineBlank
                                    sx={{ fontSize: "0.8rem" }}
                                />
                            )}
                        </div>
                        <div
                            className={`${styles.content} ${
                                avatarResult && `${styles.done}`
                            }`}
                        >
                            player &nbsp;
                            {avatar.filter((v) => v === true).length}/
                            {avatar.length}
                        </div>
                    </div>
                    {/* Shield */}
                    <div className={`${styles.item}`}>
                        <div className={`${styles.check}`}>
                            {shieldResult ? (
                                <CheckBox
                                    sx={{ color: color, fontSize: "0.8rem" }}
                                />
                            ) : (
                                <CheckBoxOutlineBlank
                                    sx={{ fontSize: "0.8rem" }}
                                />
                            )}
                        </div>
                        <div
                            className={`${styles.content} ${
                                shieldResult && `${styles.done}`
                            }`}
                        >
                            shield &nbsp;
                            {shield.filter((v) => v === true).length}/
                            {shield.length}
                        </div>
                    </div>
                </div>
                {/* Google Form */}
                <div className={`${styles.buttonArea}`}>
                    {total.reduce(
                        (previous, current) => previous && current
                    ) ? (
                        <div className={`${styles.button}`}>
                            <a
                                href={`${googleFormsURL}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Google Forms &rarr;
                            </a>
                        </div>
                    ) : (
                        <div className={`${styles.unableButton}`}>
                            Google Forms &rarr;
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
