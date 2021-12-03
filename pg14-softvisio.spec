#!/bin/bash
# vim: ft=sh

NAME=pg14-softvisio
EPOCH=1
VERSION=$(git ls-remote --tags git://github.com/softvisio/pg-softvisio.git | perl -lne 'm[refs/tags/v([\d.]+)$]sm ? print $1 : next' | sort -V | tail -n 1)
REVISION=1
ARCHITECTURE=all
DESCRIPTION="Admin tools for PostgreSQL"
PG_VERSION=14

function build() {
    apt install -y postgresql-server-dev-$PG_VERSION gcc cmake make libssl-dev libkrb5-dev libipc-run-perl

    curl -fsSL https://github.com/softvisio/pg-softvisio/archive/v$VERSION.tar.gz | tar --strip-components=1 -xzf -

    make install DESTDIR=$DESTDIR USE_PGXS=1
}
