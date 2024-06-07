#!/bin/sh

rm mysqldump-layer.zip

docker build -t mysqldump-layer .
docker run --rm mysqldump-layer > mysqldump-layer.zip
