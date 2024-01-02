# SkyBoard
## 概要
- 映像内へのペイントや画像配置を行うことができるライブ配信アプリです
- 詳細は[Qiitaの記事](https://qiita.com/KOU256/items/2d9dc37f55dae68be7b4)でも説明しています
- アプリケーションは[こちら](https://skyboard-9bf56.web.app/)で公開しています

## ディレクトリ構成
- `src`: 基本的なソースコードを管理しているディレクトリ
    - `assets/`: ソースコードから参照する画像ファイルなどソースコード以外のファイルを管理している
    - `components/`: Vue.jsのコンポーネントを管理している
    - `js/module/`: JavaScriptの処理を記述したファイルを管理している
- `public`: 公開する必要があるがソースコードから参照されていないファイルを管理している
- `functions`: Firebase Functionsに関するファイルを管理しているディレクトリ

## 動作環境
- 開発はNode.js 18.18.0で行ったため，このバージョン以上が導入されていることを前提としています
- Node.jsのインストールについては[asdf](https://asdf-vm.com/guide/getting-started.html)や[Volta](https://docs.volta.sh/guide/getting-started)などを使用すると良いと思います
- 開発およびデプロイにFirebaseを使用しているため，[Firebase CLI](https://firebase.google.com/docs/cli?hl=ja)についても同様にインストールおよびログインが完了した状態にしてください
### 前準備
- ローカルでアプリケーションを動作させるためには以下のファイルが必要です
- `.env`: 環境変数を記述するためのファイル
    - SkyWayを使用するためのAppIDやSecret Keyを読み込むために使用します
    ```shell
    VITE_SKYWAY_APP_ID=${Your SkyWay App ID}
    VITE_SKYWAY_SECRET_KEY=${Your Skyway Secret Key}
    ```
- 合わせて`src/main.js`内でFirebase Functions Emulatorを使用する設定を有効化してください
    ```javascript:./src/main.js
    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig);
    const functions = getFunctions(firebaseApp);
    // connectFunctionsEmulator(functions, "localhost", 8081); // ローカルで開発する場合はこの行のコメントを解除
    ```

### パッケージのインストール
- npmの必要なパッケージをインストールします
```shell
npm install
cd functions
npm install
```

### 開発サーバーの実行
- プロジェクトのルートディレクトリで以下のコマンドを実行します
```shell
npm run dev
```
- `http://localhost:5173`にアクセスしてページが表示されれば成功です

### ビルド・デプロイ
- Firebaseにデプロイする際はデプロイ先のプロジェクトを`.firebaserc`に記載してください
```json:.firebaserc
{
  "projects": {
    "default": "Your Firebase Project ID"
  }
}
```
- `src/main.js`でFirebase Emulatorを使用する設定になっている場合はビルド前に該当箇所をコメントアウトしてください
- シークレットキーなどを秘匿したままSkyWay Tokenを取得する処理を実行するためにFirebase Functionsを使用しています
    - 同様の構成で行う場合はFirebaseプロジェクトを従量課金プランに変更しておく必要があります
    - 他の仕組みを使う場合などは適宜処理を置き換えてください
- `functions/.env`として前準備と同等の内容の.envファイルを作成してください
```shell
npm run build
firebase deploy
```
