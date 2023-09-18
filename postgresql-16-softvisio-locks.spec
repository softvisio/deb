#!/bin/bash
# vim: ft=sh

POSTGRESQL_VERSION=16

NAME=postgresql-$POSTGRESQL_VERSION-softvisio-locks
EPOCH=1
VERSION=$(git ls-remote --tags https://github.com/softvisio/postgresql-softvisio-locks.git | perl -lne 'm[refs/tags/v([\d.]+)$]sm ? print $1 : next' | sort -V | tail -n 1)
REVISION=1
ARCHITECTURE=source
DESCRIPTION="PostgreSQL backend extension"

function build() {
    apt-get install -y postgresql-server-dev-$POSTGRESQL_VERSION gcc cmake make libssl-dev libkrb5-dev libipc-run-perl

    curl -fsSL https://github.com/softvisio/postgresql-softvisio-locks/archive/v$VERSION.tar.gz | tar --strip-components=1 -xzf -

    make install DESTDIR=$DESTDIR USE_PGXS=1
}
