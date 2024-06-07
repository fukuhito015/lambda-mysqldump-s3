# lambda-mysqldump-s3

## 概要
このプロジェクトは、AWS Lambdaを使用してMySQLデータベースのダンプを実行し、そのダンプファイルをAmazon S3にアップロードするための機能を提供します。以下の機能が含まれています：

1. **Lambda関数によるMySQLデータベースのダンプ実行**：
    - Lambda関数をトリガーすることで、MySQLデータベースのダンプ（mysqldump）を自動的に実行します。
    - ダンプファイルはS3にアップロードされます。

2. **Lambda LayerのためのDockerコンテナファイル作成**：
    - MySQLのDumpコマンドやその他必要なツールを含むLambda Layerを作成するためのDockerコンテナファイルを提供します。
    - このLayerを利用することで、Lambda関数内でmysqldumpを実行するための環境を構築できます。

## 構成

- `index.mjs`: Lambda関数のメインスクリプト。MySQLデータベースのダンプを実行し、S3にアップロードします。lambdaのindex.mjsに貼り付けてください。
- `Dockerfile`: Lambda Layerを作成するためのDockerコンテナファイル。必要なツール（MySQLのDumpコマンドなど）を含みます。

## 使用方法

### 前提条件
- AWSアカウント
- Dockerのインストール
- AWS CLIの設定

### セットアップ

1. リポジトリをクローンします。
    ```bash
    git clone git@github.com:fukuhito015/lambda-mysqldump-s3.git
    cd lambda-mysqldump-s3
    ```

2. Dockerコンテナをビルドして、Lambda Layerを作成します。
    ```bash
    bash docker-build.sh
    ```

### AWS Consoleでの設定（メモ）

### lambda

ver: node 20.x

index.mjsのコードをlambdaのindex.mjsにコピペ

lambdaロール権限で「s3許可」「AWSLambdaVPCAccessExecutionRole」

メモリを1024g、タイムアウトを1分0秒程度

mysqldump-layer.zipをlambda-layerに設定

### cloudwatch events
cloudwatch eventsで設定 例: cron(0 * * * ? *) で1時間おき

lambdaにrdsのVPCを設定。セキュリティグループ（in port:3306 full, out port:ALL full）


### vpc
lambdaが属するVPCにVPCエンドポイントを設定


### rds
lambdaに設定したセキュリティグループをRDSで3306許可