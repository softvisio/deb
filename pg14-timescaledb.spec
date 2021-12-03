#!/bin/bash
# vim: ft=sh

NAME=pg14-timescaledb
EPOCH=1
VERSION=$(git ls-remote --tags git://github.com/timescale/timescaledb.git | perl -lne 'm[refs/tags/([\d.]+)$]sm ? print $1 : next' | sort -V | tail -n 1)
REVISION=1
ARCHITECTURE=source
DESCRIPTION="TimescaleDB extension for PostgreSQL"
OPTFLAGS="-O2 -g" # rpm --eval "%{optflags}"
LD_FLAGS=         # rpm --eval "%{build_ldflags}" XXX
MAKE_FLAGS="-j4"  # rpm --eval "%{_smp_mflags}"
PG_VERSION=14

function build() {
    apt install -y postgresql-server-dev-$PG_VERSION gcc cmake make libssl-dev libkrb5-dev libipc-run-perl

    curl -fsSL https://github.com/timescale/timescaledb/archive/$VERSION.tar.gz | tar --strip-components=1 -xzf -

    ./bootstrap
    cd build && make $MAKE_FLAGS CLANG=clang

    # timescaledb
    make install DESTDIR=$DESTDIR
}
