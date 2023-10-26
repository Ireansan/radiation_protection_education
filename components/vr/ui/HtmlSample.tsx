import { LevaPanel, useControls, useCreateStore } from "leva";

import { Html } from "./core";

export function HtmlSample() {
    const testStore = useCreateStore();
    const test = useControls(
        {
            size: {
                value: 1,
                min: 0,
                max: 5,
            },
        },
        { store: testStore }
    );

    return (
        <Html width={300} height={100}>
            <div>
                <span>サイズ / Size</span>
                <div
                    style={{
                        display: "grid",
                        width: 300,
                        gap: 10,
                        paddingBottom: 40,
                        overflow: "auto",
                        background: "#181C20",
                    }}
                >
                    <LevaPanel fill flat titleBar={false} store={testStore} />
                </div>
            </div>
        </Html>
    );
}
