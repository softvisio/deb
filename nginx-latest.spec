#!/bin/bash
# vim: ft=sh

NAME=nginx-latest
EPOCH=1
VERSION=$(git ls-remote --tags https://github.com/nginx/nginx.git | perl -lne 'm[refs/tags/release-([\d.]+)$]sm ? print $1 : next' | sort -V | tail -n 1)
REVISION=1
ARCHITECTURE=source
DESCRIPTION="A high performance web server and reverse proxy server"
OPTFLAGS="-O2 -g" # rpm --eval "%{optflags}"
LD_FLAGS=         # rpm --eval "%{build_ldflags}" XXX
MAKE_FLAGS="-j4"  # rpm --eval "%{_smp_mflags}"

function build() {
    apt-get install -y gcc g++ make libpcre3-dev zlib1g-dev libssl-dev libmaxminddb-dev

    curl -fsSL https://nginx.org/download/nginx-$VERSION.tar.gz | tar --strip-components=1 -xz
    git clone https://github.com/softvisio/nginx-http-geoip2
    git clone https://github.com/softvisio/nginx-dynamic-upstream

    # build
    # --user=%{nginx_user} \
    # --group=%{nginx_user} \
    # --with-http_xslt_module=dynamic \
    # --with-http_image_filter_module=dynamic \
    # --with-http_perl_module=dynamic \
    # --with-mail=dynamic \
    # --with-mail_ssl_module \
    # --with-http_dav_module \

    ./configure \
        --sbin-path=/usr/local/sbin/nginx \
        --with-threads \
        --with-file-aio \
        --with-pcre \
        --with-pcre-jit \
        --with-stream \
        --with-cc-opt="$OPTFLAGS $(pcre-config --cflags)" \
        --with-ld-opt="$LD_FLAGS -Wl,-E" \
        --with-http_addition_module \
        --with-http_auth_request_module \
        --with-http_degradation_module \
        --with-http_flv_module \
        --with-http_gunzip_module \
        --with-http_gzip_static_module \
        --with-http_mp4_module \
        --with-http_random_index_module \
        --with-http_realip_module \
        --with-http_secure_link_module \
        --with-http_slice_module \
        --with-http_ssl_module \
        --with-http_stub_status_module \
        --with-http_sub_module \
        --with-http_v2_module \
        --with-stream_ssl_module \
        --add-dynamic-module=nginx-http-geoip2 \
        --add-module=nginx-dynamic-upstream

    make $MAKE_FLAGS

    # install
    make install DESTDIR=$DESTDIR
}
