import React from "react";
import { applyBasePath } from "../../../../utils";

import style from "../../../../styles/css/tips.module.css";

export type TipsItemProps = {
    children: React.ReactNode;
    imgSrc: string;
    imgAlt?: string;
};

export function TipsItem({
    children,
    imgSrc,
    imgAlt,
    ...props
}: TipsItemProps) {
    return (
        <>
            <div className={`${style.tipsItem}`}>
                <div className={`${style.text}`}>{children}</div>
                <div className={`${style.img}`}>
                    <img
                        src={applyBasePath(imgSrc)}
                        alt={imgAlt}
                    />
                </div>
            </div>
        </>
    );
}
