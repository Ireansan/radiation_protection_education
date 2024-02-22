# ボリュームレンダリング用クラスについて

## VolumeとDoseの違い
`VolumeBase`, `DoseBase`など`Volume[XXX]`, `Dose[XXX]`といったクラスが`src/volumeRender`内にある。
これら`Dose[XXX]`は開発初期段階の名残で，名前が違うだけで中身はほとんど`Volume[XXX]`と同じです。

## コントローラーの使い方の基本
ボリュームレンダリングオブジェクトとコントローラーはrefを用いて接続しています。

以下の例では，グループに`ref`を指定することで子全体にパラメーター・クリッピングコントローラーの影響が反映されます。
また，アニメーションコントローラーでは`objects`に`animationRef1`, `animationRef2`を指定することで，同タイミングでのアニメーション再生を可能にしています。

```tsx
const ref = useRef<DoseGroup>(null!);

const animationRef1 = useRef<DoseAnimationObject>(null);
const animationRef2 = useRef<DoseAnimationObject>(null);

// ...

return (
    <>
        {/* ... */}

        <Canvas>
            {/* -------------------------------------------------- */}
            {/* Volume Object */}
            {/* ==================== */}
            {/* Volume Group */}
            <doseGroup ref={ref}>
                {/* ------------------------- */}
                {/* Volume Animation Object 1 */}
                <doseAnimationObject ref={animationRef1}>
                    <VOLUMEDATA.XRay_nocurtain_all_Animation />
                </doseAnimationObject>
                {/* ------------------------- */}
                {/* Volume Animation Object 2 */}
                <doseAnimationObject ref={animationRef2}>
                    <VOLUMEDATA.XRay_curtain_all_Animation />
                </doseAnimationObject>
            </doseGroup>

            {/* -------------------------------------------------- */}
            {/* Controls */}
            {/* ========================= */}
            {/* Volume Controls */}
            {/* ------------------------- */}
            {/* Animation Controls */}
            <VolumeAnimationControls
                objects={[animationRef1, animationRef2]}
                duration={16}
            />
            {/* ------------------------- */}
            {/* Parameter Controls */}
            <VolumeParameterControls object={ref} />
            {/* ------------------------- */}
            {/* Clipping Controls */}
            <VolumeXYZClippingControls object={ref} />

            {/* ... */}

        </Canvas>
    </>
)
```

## ボリュームオブジェクトのメンバー変数の更新について
一部メンバー変数は代入などのタイミングで，子のメンバー変数も更新されます。
`updateVolumeParam`, `updateVolumeClipping`で更新の処理は実行され，自動更新停止をしていない場合は基本的に親の値が反映されます。

以下の例では，`Volume Animation Object 1`の`clim2`は固定となり，親の`Volume Group`をパラメーターコントローラーで操作しても変更されなくなります。
`Volume Animation Object 2`は`clim2AutoUpdate={false}`としていないため，`Volume Group`の変更が反映されます。

```tsx
return (
    <>
        {/* ... */}

        <Canvas>
            {/* -------------------------------------------------- */}
            {/* Volume Object */}
            {/* ==================== */}
            {/* Volume Group */}
            <doseGroup ref={ref}>
                {/* ------------------------- */}
                {/* Volume Animation Object 1 */}
                <doseAnimationObject
                    ref={animationRef1}
                    clim2={
                        VOLUMEDATA.CArm_Configure.volume.clim2
                            .timelapse
                    }
                    clim2AutoUpdate={false}
                >
                    <VOLUMEDATA.CArm_all_Animation />
                </doseAnimationObject>
                {/* ------------------------- */}
                {/* Volume Animation Object 2 */}
                <doseAnimationObject ref={animationRef2}>
                    <VOLUMEDATA.CArm_roll180_pitch360_all_Animation />
                </doseAnimationObject>
            </doseGroup>

            {/* ... */}

        </Canvas>
    </>
)
```

## クリッピングに用いるメンバー変数について
防護板用コントローラーや断面用コントローラーを接続したオブジェクトの`clippingPlanesObjects`にコントローラーで制御されるクリッピング平面などの情報を持ったインスタンスが追加されます。
インスタンスの追加は初回のみで，`pushClippingPlanesObjects`で実行されています。

クリッピングや防護板を有効にしたタイミングで実行される`updateVolumeClipping`では，`clippingPlanesObjects`の要素をもとにシェーダーに渡すクリッピング平面の配列を更新します。
クリッピング平面がどのコントローラーのものか，防護板のものか否かの判別に用いる配列も同様に更新しています。

防護板の擬似的な再現にクリッピングの処理を用いており，さらにクリッピング平面による断面表示を両立させるためにこのような仕組みになっています。