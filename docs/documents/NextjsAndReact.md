# Next.js, React について

Last Update: 2024/03/18
Author: Kento Oka

## 概要
Next.jsはVercelという会社が提供しているReactベースのフレームワークで，Reactで書かれた複数のページを取り扱うことができる。
ReactはMetaが開発したUI構成のためのライブラリで，コンポーネントと呼ばれる要素を用いることでページを構成することができる。SSG（Static Site Generator, 静的サイト生成）だけでなくSSR（Server Side Rendering, サーバーサイドレンダリング）に対応している他，様々な機能が提供されている。

## 学習に関して
### 前提
筆者はSSGで開発したためSSRに対する理解は浅いです。
また，2022年時点のバージョンで開発を進めたため，ライブラリの仕様が変わっている可能性があります。
Reactに関しては感覚で理解している部分があり，正しい説明でない可能性があります。

### Next.js
Next.js公式の[examples](https://github.com/vercel/next.js/tree/deprecated-main/examples)で様々な例があるので，作りたいものに合った例を参考にすると良いと思います。
筆者は[Docker Compose](https://docs.docker.com/compose/)を使いたかったため，[examples/with-docker-compose](https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose/docker-compose.dev.yml)を参考に進めました。

Next.jsは`pages`の`index.tsx`がメインページになり，ページになるファイルを`pages`に置くことで一つのページとしてルーティングされる，というのが基本になります。
詳しくは[公式のドキュメント](https://nextjs.org/docs)を読みながら進めれば問題ないと思います。

### React
まず，Next.jsより学習難易度が高いと思います。
フック（Hook）と呼ばれるReact特有の仕組みがあること，3DCGを用いることが主な理由です。

Reactではフックは変数のような役割をする`useState`や`useRef`, `useMemo`と，イベントのような役割をする`useEffect`, `useEffectLayout`といったものなどがあります。
さらに`useState`は`set`するとDOM要素のレンダリングが発生する，`useMemo`, `useEffect`は指定した要素が更新された場合に発火する，`useEffect`で何も指定しない場合最初のレンダリングで発火する，など各フックで挙動が違います。
（ここでのレンダリングは3DCGではなく，DOM要素の更新の意味です。）
また，Reactで3DCGを扱いやすくした[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)というライブラリを用いていますが，コンポーネント単位で毎フレームの処理を指定できる`useFrame`といったフックもあります。

DOM要素のレンダリング処理は重いため，毎フレーム`useState`で`set`行ったりするとフレームレートが低下します。
そのため，毎フレームの処理やドラッグイベントでは`useRef`で値を管理することが多いです。

UIの更新処理は`useState`などステートの更新を行わないと実行されないため，`useRef`の値を更新してもUIの表示は変わりません。
また，コンポーネント間の値の共有をReactのフックだけで行おうとするとかなり複雑になります。
そのため，一般的にはステート管理ライブラリと呼ばれるライブラリを使います。
筆者はReact Three Fiberの開発元が作成した[zustand](https://github.com/pmndrs/zustand)というステート管理ライブラリを用いました。

3DCGが関係するフックはかなり複雑なので，筆者の場合は[Zenn](https://zenn.dev/)や[Qiita](https://qiita.com/)で参考になりそうな記事を調べながら，React Three Fiberの[Examples](https://docs.pmnd.rs/react-three-fiber/getting-started/examples)などを参考に，シーンを作って試すことで理解していきました。
また，コンポーネントの作成の際には，[React Three Drei](https://github.com/pmndrs/drei)など[React Thee Fiber関連のライブラリ](https://github.com/pmndrs/react-three-fiber?tab=readme-ov-file#ecosystem)のソースコードを参考にしました。

#### 余談
Reactはクラスコンポーネントと関数コンポーネントの2つのコンポーネントの書き方があります。
2022年頃からクラスコンポーネントは非推奨となりましたが，その当時はクラスコンポーネントでの作例などが見られました。
おそらく既にReactで検索して，クラスコンポーネントの記事が出ることは少ないと思います。

しかし，Reactに限らず参考になる記事などを探す場合，記事で説明しているコードで使われているライブラリのバージョンに注意して下さい。

### ChatGPT 3.5
筆者はプロンプトの指定が苦手なので，ChatGPT 3.5を上手く使えなかっただけかもしれませんが，あまり精度は高くありませんでした
（そもそもWebページで3DCGをやる人は全体として少ないことに加え，React Three Fiberで作成する例が少なかった可能性もある）。
ChatGPT 4.0, Copilotでは違うかもしれないため，試してみてください。

注意点として，クラスコンポーネントや非推奨のライブラリといった古い書き方をする可能性があります。
筆者の場合，Firebaseを使った簡単なプロジェクトをChatGPT 3.5で生成してもらったところ，一つ古いバージョンのFirebaseを使用し，既に非推奨のライブラリを使用したコードが生成されました。