#!/bin/bash
# vim: ft=sh

POSTGRESQL_VERSION=15

NAME=postgresql-$POSTGRESQL_VERSION-softvisio-types
EPOCH=1
VERSION=$(git ls-remote --tags https://github.com/softvisio/postgresql-softvisio-types.git | perl -lne 'm[refs/tags/v([\d.]+)$]sm ? print $1 : next' | sort -V | tail -n 1)
REVISION=1
ARCHITECTURE=source
DESCRIPTION="PostgreSQL types extension"

function build() {
    apt-get install -y postgresql-server-dev-$POSTGRESQL_VERSION gcc cmake make libssl-dev libkrb5-dev libipc-run-perl

    curl -fsSL https://github.com/softvisio/postgresql-softvisio-types/archive/v$VERSION.tar.gz | tar --strip-components=1 -xzf -

    make install DESTDIR=$DESTDIR USE_PGXS=1
}