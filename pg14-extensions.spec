#!/bin/bash
# vim: ft=sh

NAME=pg14-extensions
EPOCH=1
VERSION=1.0.1
REVISION=1
ARCHITECTURE=source
DESCRIPTION="Extensions for Postgres"
OPTFLAGS="-O2 -g" # rpm --eval "%{optflags}"
LD_FLAGS=         # rpm --eval "%{build_ldflags}" XXX
MAKE_FLAGS="-j4"  # rpm --eval "%{_smp_mflags}"
PG_VERSION=14
TIMESCALEDB_VERSION=$(git ls-remote --tags git://github.com/timescale/timescaledb.git | perl -lne 'm[refs/tags/([\d.]+)$]sm ? print $1 : next' | sort -V | tail -n 1)

function build() {
    apt install -y postgresql-server-dev-$PG_VERSION gcc cmake make libssl-dev libkrb5-dev libipc-run-perl

    mkdir $PWD/pg_softvisio
    curl -fsSL https://github.com/softvisio/pg-softvisio/archive/latest.tar.gz | tar -C $PWD/pg_softvisio --strip-components=1 -xzf -

    mkdir $PWD/timescaledb
    curl -fsSL https://github.com/timescale/timescaledb/archive/$TIMESCALEDB_VERSION.tar.gz | tar -C $PWD/timescaledb --strip-components=1 -xzf -

    # timescaldb
    pushd $PWD/timescaledb
    ./bootstrap
    cd build && make $MAKE_FLAGS CLANG=clang
    popd

    # pg_softvisio
    pushd $PWD/pg_softvisio
    make install DESTDIR=$DESTDIR USE_PGXS=1
    popd

    # timescaledb
    pushd $PWD/timescaledb/build
    make install DESTDIR=$DESTDIR
    popd
}
