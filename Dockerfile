# ベースイメージとしてAmazon Linux 2を使用
FROM amazonlinux:2

# パッケージのインストールとファイルコピー
RUN yum update -y && \
    yum install -y mysql zip gzip openssl && \
    mkdir -p /opt/bin && \
    mkdir -p /opt/lib && \
    cp /usr/bin/mysqldump /opt/bin/ && \
    cp /bin/gzip /opt/bin/ && \
    cp /usr/lib64/libssl.so.10 /opt/lib/ && \
    cp /usr/lib64/libcrypto.so.10 /opt/lib/ && \
    cp /usr/lib64/libz.so.1 /opt/lib/ && \
    cp /usr/lib64/libc.so.6 /opt/lib/ && \
    cp /usr/lib64/libm.so.6 /opt/lib/ && \
    cp /usr/lib64/libdl.so.2 /opt/lib/ && \
    cp /usr/lib64/libpthread.so.0 /opt/lib/ && \
    cp /usr/lib64/libcrypt.so.1 /opt/lib/ && \
    cd /opt && \
    zip -r9 /mysqldump-layer.zip .

# zipファイルをローカルに保存するため
CMD ["cat", "/mysqldump-layer.zip"]
