import React from "react";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";

import { useStore } from "../store";

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
    const dosimeter = [
        Dosimeter.goggle,
        Dosimeter.neckGuard,
        Dosimeter.apron,
        Dosimeter.glove,
    ];

    const total = [
        ...animation,
        ...colormap,
        ...renderStyle,
        ...clipping,
        ...clippingInvert,
        ...avatar,
        ...shield,
        ...dosimeter,
    ];

    return (
        <>
            <div className={`${styles.experiment}`}>
                <h2>Exepriment Check List</h2>
                {/* animation mode */}
                <div className={`${styles.item}`}>
                    <div className={`${styles.check}`}>
                        {animation.reduce(
                            (previous, current) => previous && current
                        ) ? (
                            <CheckBox
                                sx={{ color: color, fontSize: "0.8rem" }}
                            />
                        ) : (
                            <CheckBoxOutlineBlank sx={{ fontSize: "0.8rem" }} />
                        )}
                    </div>
                    <div className={`${styles.content}`}>
                        animation mode &nbsp;
                        {animation.filter((v) => v === true).length}/
                        {animation.length}
                    </div>
                </div>
                {/* color map */}
                <div className={`${styles.item}`}>
                    <div className={`${styles.check}`}>
                        {colormap.reduce(
                            (previous, current) => previous && current
                        ) ? (
                            <CheckBox
                                sx={{ color: color, fontSize: "0.8rem" }}
                            />
                        ) : (
                            <CheckBoxOutlineBlank sx={{ fontSize: "0.8rem" }} />
                        )}
                    </div>
                    <div className={`${styles.content}`}>
                        colormap &nbsp;
                        {colormap.filter((v) => v === true).length}/
                        {colormap.length}
                    </div>
                </div>
                {/* render style */}
                <div className={`${styles.item}`}>
                    <div className={`${styles.check}`}>
                        {renderStyle.reduce(
                            (previous, current) => previous && current
                        ) ? (
                            <CheckBox
                                sx={{ color: color, fontSize: "0.8rem" }}
                            />
                        ) : (
                            <CheckBoxOutlineBlank sx={{ fontSize: "0.8rem" }} />
                        )}
                    </div>
                    <div className={`${styles.content}`}>
                        render style &nbsp;
                        {renderStyle.filter((v) => v === true).length}/
                        {renderStyle.length}
                    </div>
                </div>
                {/* clipping */}
                <div className={`${styles.item}`}>
                    <div className={`${styles.check}`}>
                        {clipping.reduce(
                            (previous, current) => previous && current
                        ) ? (
                            <CheckBox
                                sx={{ color: color, fontSize: "0.8rem" }}
                            />
                        ) : (
                            <CheckBoxOutlineBlank sx={{ fontSize: "0.8rem" }} />
                        )}
                    </div>
                    <div className={`${styles.content}`}>
                        clipping x, y, z, free &nbsp;
                        {clipping.filter((v) => v === true).length}/
                        {clipping.length}
                    </div>
                </div>
                <div className={`${styles.item}`}>
                    <div className={`${styles.check}`}>
                        {clippingInvert.reduce(
                            (previous, current) => previous && current
                        ) ? (
                            <CheckBox
                                sx={{ color: color, fontSize: "0.8rem" }}
                            />
                        ) : (
                            <CheckBoxOutlineBlank sx={{ fontSize: "0.8rem" }} />
                        )}
                    </div>
                    <div className={`${styles.content}`}>
                        clipping invert &nbsp;
                        {clippingInvert.filter((v) => v === true).length}/
                        {clippingInvert.length}
                    </div>
                </div>
                {/* avatar */}
                <div className={`${styles.item}`}>
                    <div className={`${styles.check}`}>
                        {avatar.reduce(
                            (previous, current) => previous && current
                        ) ? (
                            <CheckBox
                                sx={{ color: color, fontSize: "0.8rem" }}
                            />
                        ) : (
                            <CheckBoxOutlineBlank sx={{ fontSize: "0.8rem" }} />
                        )}
                    </div>
                    <div className={`${styles.content}`}>
                        avatar &nbsp;
                        {avatar.filter((v) => v === true).length}/
                        {avatar.length}
                    </div>
                </div>
                {/* shield */}
                <div className={`${styles.item}`}>
                    <div className={`${styles.check}`}>
                        {shield.reduce(
                            (previous, current) => previous && current
                        ) ? (
                            <CheckBox
                                sx={{ color: color, fontSize: "0.8rem" }}
                            />
                        ) : (
                            <CheckBoxOutlineBlank sx={{ fontSize: "0.8rem" }} />
                        )}
                    </div>
                    <div className={`${styles.content}`}>
                        shield &nbsp;
                        {shield.filter((v) => v === true).length}/
                        {shield.length}
                    </div>
                </div>
                {/* dosimeter */}
                <div className={`${styles.item}`}>
                    <div className={`${styles.check}`}>
                        {dosimeter.reduce(
                            (previous, current) => previous && current
                        ) ? (
                            <CheckBox
                                sx={{ color: color, fontSize: "0.8rem" }}
                            />
                        ) : (
                            <CheckBoxOutlineBlank sx={{ fontSize: "0.8rem" }} />
                        )}
                    </div>
                    <div className={`${styles.content}`}>
                        dosimeter equipment &nbsp;
                        {dosimeter.filter((v) => v === true).length}/
                        {dosimeter.length}
                    </div>
                </div>
                {/* Google Form */}
                <div className={`${styles.buttonArea}`}>
                    {total.reduce(
                        (previous, current) => previous && current
                    ) ? (
                        <div className={`${styles.button}`}>
                            <a
                                href={`${process.env.NEXT_PUBLIC_GOOGLE_FORMS}`}
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
