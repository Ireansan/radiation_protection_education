# ToDo - SSR (Server Side Rendering) の対応について

Last Update: 2024/03/18
Author: Kento Oka

2024/03 現在，[GitHub Pages](https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages)で公開しているためSSG (Static Site Generate)で動作しています。
そのためユーザー登録や利用者に合わせたコンテンツの変更，成績の記録といった機能が利用できません。
これらに対応するためにはSSR (Server Side Rendering) への対応が必要となっています。

SSRへの対応方法としては，[Vercel](https://vercel.com/)や[Firebase](https://firebase.google.com/?hl=ja)といった課金制のサービスを利用するか，学校のサーバーで動作するように設定する方法が考えられます。
VercelはNext.jsの開発元で，FirebaseはGoogleが提供しているサービスでどちらも課金制のサービスとなっています。
(Firebaseは無料プランもありますが，利用できる機能の制限がかかっています。また，無料で使える範囲を超えると請求が発生する可能性もあります。)
Next.jsで開発したWebアプリを公開する方法について，多くの記事でVercel, Firebaseを用いた方法が紹介されています。

筆者は自前でサーバーを用意して公開する方法の記事を見つけられておりません。
学校のサーバーで動作させる場合，[こちらの記事](https://qiita.com/piny940/items/eddf7a8450a011eda85c)など参考になりそうな記事を探して下さい。

SSRへの対応は，リアルタイムシミュレーションやマルチプレイといった機能の実現のためには必要ですが，研究としての新規性にはならないと思われます。
そのため，「ユーザーのスキルに合わせたコンテンツの変化」など，サーバーと通信できることを活かした機能も実装する必要があると思います。
