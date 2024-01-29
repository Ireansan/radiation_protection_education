# VR教材

## 実験内容
可視化教材のVR版を体験していただきます。

操作説明に記載されている操作を一通り実施していただき，実験用ページ内にあるGoole フォームのリンクにアクセスし，回答をお願いいたします。
チェックリストなどは用意していないため，全て完了したかの判断はお任せします。
Oculusの静止モードで，立ってプレイして下さい。

なお，処理負荷を下げるため以下の制限が設けています。不具合ではございません。
- 線量分布に一定距離まで近づくと，線量分布を非表示にする
- 線量計で測定できる部位は右手，左手のみ
- 線量計の数値の更新はトリガー，グリップを操作した時のみ

確認されている不具合は，後述しております。操作説明と合わせてご確認下さい。

---
# 操作説明
## コントローラー操作
コントローラーの操作は両手で共通しています。

### 移動
コントローラーのトリガーを押すことで，床に表示される丸い円の位置に移動します。

線量計や操作パネルはプレイヤーの位置に追従しており，線量分布の中心方向を向くようになっています。

<p align=center>
    <img src=../public/img/manual/tips/gif/VR/move.gif alt="gif/VR/move" width="50%" />
</p>


### 線量計の更新 &middot; プレイヤーの配置
初期状態では，プレイヤーがヘッドセットに追従しており，床にコントローラーのレイが衝突していない状態でトリガーを押すと，線量計が更新されます。
操作パネルのスライダー操作でも同様に更新されます。

また，グリップ（コントローラーの横にあるボタン）を押すことで，ヘッドセットとコントローラーの位置を反映したプレイヤーが配置され，線量計が更新されます。
プレイヤーが既に配置されている状態でグリップを押すと，プレイヤーが再びヘッドセットに追従します。

<p align=center>
    <img src=../public/img/manual/tips/gif/VR/PlayerSet.gif alt="gif/VR/PlayerSet" width="50%" />
</p>


## 操作パネル
### 防護具
操作パネルの`Equipments`のスライダーを0から1にすることで，防護具が有効になり，3Dモデルに反映されます。

<p align=center>
    <img src=../public/img/manual/tips/gif/VR/Equipments.gif alt="gif/VR/Equipments" width="50%" />
</p>


### type
各シーンによって`type`を変更することで，対応する状態に変化します。

X線検査室では3つ用意されており，以下のように対応しています。
- 1：カーテン無し
- 2：カーテン無し，照射野 15&times;15[cm]
- 3：カーテン有り

<p align=center>
    <img src=../public/img/manual/tips/gif/VR/type_XRay.gif alt="gif/VR/type_XRay" width="50%" />
</p>


Cアームでは2つ用意されており，以下のように対応しています。
- 1：真上から照射
- 2：横から照射

<p align=center>
    <img src=../public/img/manual/tips/gif/VR/type_CArm.gif alt="gif/VR/type_CArm" width="50%" />
</p>

---
# 不具合
## VRモードの再入場が出来ない
### 詳細
一度VRモードを抜けて，再度`Enter VR`を押し再入場をしようとすると，黒い画面でロードの表示が出たままになる。

### 対処方法
ページのリロードを行なって下さい。

## Cアームでの線量分布の描画
### 詳細
`clim1`の値が`clim2`に近い時と同様の描画がされる。

### 対処方法
未解決

## 線量計UIが3Dモデルに被る
### 詳細
常に手前に描画されるように，レンダリングの優先度の変更したが反映されず，シーン内の3Dモデル(線量分布も含む)に被る。

### 対処方法
未解決