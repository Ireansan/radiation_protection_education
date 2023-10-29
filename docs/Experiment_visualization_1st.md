# Experiment (visualization, 1st)

## 実験内容
レントゲン室，C アームの少なくとも一つのページで，可視化教材としてチェックリストの内容を全て実施していただきます。

### チェックリスト
注意：一度，操作を行うと「実施した」と記録されるため，全ての要求項目を同時に満たす必要はありません。

#### equipments
操作パネルの`Player/Equipments`で，4つの装備全てを有効にする

#### data mode
操作パネルの`Data/mode`を操作し，`time lapse`, `accumulate`の2つのデータモードで，線量分布を確認する

#### color map
操作パネルの`Data/Parameter/colormap`を操作し，全13種類のカラーマップを，全て確認する

#### render style
操作パネルの`Data/Parameter/renderstyle`を操作し，`mip`, `iso`の2つのレンダリングスタイルで線量分布を確認する

#### clip x, y, z, free axis
操作パネルの`Data/Clip`で，全てのクリッピング平面を有効にする

#### clip invert
操作パネルの`Data/Clip`内のいづれか1つのクリッピング平面の向きを`invert`を有効にし，反転させる

#### player
3D空間内のコントローラーを操作し，playerの位置と両手の位置を変える

#### shield
3D空間内のコントローラーを操作し，防護板を線量分布内に入れ，移動させることで線量がどのように変わるか確認する

---
## 画面構成

### 3D空間

### 線量分布データ

---
## 内容

<!-- --- -->
### 操作パネル
#### Scene

##### Gimmick
シーン毎に固有の結果を返します。

[img/leva/Scene/Gimmick_XRay]
[img/leva/Scene/Gimmick_CArm]

- レントゲン室(X-Ray)：カーテンの有無を操作できます。
- Cアーム(C-Arm)：患者に対して真上から照射した場合と，横から照射した場合の2つの場面に切り替えられます。

#### Player

##### Equipments
放射線防護具の装備の有無を選択できます。

[img/leva/Player/Equipments]

装備を有効にすると，線量計UIに種類に応じたアイコンが表示され，被ばく量が変化します。

[img/DosimeterUI/Icon_Equipments]

##### Dosimeter Config
線量計UIの表示と，被ばく量の計算に関係する値の設定ができます。

[img/leva/Player/Dosimeter_Config]

- `N (/patient)`：患者一人に対して行う照射回数
- `N (/year)`：年間に実施を予定している処置回数
- `Limit (/once)`：一回の処置での目標上限線量

年間の被ばく量は`N (/patient) * N (/year)`，一回の被ばく量は`N (/patient)`で計算されます。

#### Data

##### mode

[img/leva/Data/mode]

##### Animation

[img/leva/Data/Animation]

##### Parameter

[img/leva/Data/Parameter]

##### Clip

[img/leva/Data/Clip]

<!-- --- -->
### 3D空間

#### Player

[img/3D/Player]

#### Shield

[img/3D/Shield]

#### Clipping Plane

[img/3D/ClippingPlane]
