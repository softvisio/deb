#!/bin/bash

SCRIPT_DIR="$(cd -P -- "$(dirname -- "$0")" && pwd -P)"

_DISTS=$SCRIPT_DIR/dists
_COMPONENT=main

# init
_BUILD_ROOT=$(mktemp -d)
BUILD=$_BUILD_ROOT/build
DESTDIR=$_BUILD_ROOT/install
DEBIAN=$DESTDIR/DEBIAN
mkdir -p $BUILD
mkdir -p $DEBIAN

# spec variables
NAME=
EPOCH=1
VERSION=
REVISION=1
ARCHITECTURE=
DEPENDS=
DESCRIPTION=
MAINTAINER="zdm <zdm@softvisio.net>"

# apt update

# load spec
. $1

function _build_local() {
    local cwd=$PWD

    cd $BUILD

    local error

    _build

    if [[ $? == 0 ]]; then
        _pack

        echo --- Package built successfully ---
    else
        error=1

        echo --- Package build failed ---
    fi

    cd $cwd

    # cleanup
    rm -rf $_BUILD_ROOT

    if [[ error == 1 ]]; then exit 1; fi
}

function _build_docker() { (
    docker run \
        --rm -it --shm-size=1g \
        -v $SCRIPT_DIR:/var/local \
        --workdir /var/local \
        --entrypoint /var/local/build.sh \
        "softvisio/deb:$2" \
        "$1" local

    if [[ $? != 0 ]]; then exit 1; fi
); }

function _build() { (
    set -e

    build
); }

function _pack() { (
    local VERSION_CODENAME=$(source /etc/os-release && echo $VERSION_CODENAME)
    local ARCH=$(dpkg --print-architecture)

    local BUILD_ARCH=
    local TARGET=

    if [[ $ARCHITECTURE == "all" ]]; then
        BUILD_ARCH=all
        TARGET=$_DISTS/binary-all-pool/${NAME}_$VERSION-${REVISION}_all.deb
    else
        BUILD_ARCH=$ARCH
        TARGET=$_DISTS/$VERSION_CODENAME/$_COMPONENT/binary-$ARCH/pool/${NAME}_$VERSION-${REVISION}_$ARCH.deb
    fi

    # debian/control
    cat << EOF > $DEBIAN/control
Package: $NAME
Version: $EPOCH:$VERSION-$REVISION
Architecture: $BUILD_ARCH
Installed-Size: $(du -s $DESTDIR | cut -f1)
Depends: $DEPENDS
Maintainer: $MAINTAINER
Description: $DESCRIPTION
EOF

    # debian/changelog
    cat << EOF > $DEBIAN/changelog
$NAME (0.0.0-1) UNRELEASED; urgency=low
EOF

    mkdir -p $(dirname $TARGET)
    dpkg-deb --build --root-owner-group $DESTDIR $TARGET

); }

if [ $# -eq 1 ]; then
    if [[ $ARCHITECTURE == "all" ]]; then
        _build_local
    else
        _build_docker "$1" latest
        _build_docker "$1" rolling
    fi
elif [ $# -eq 2 ]; then
    if [[ $2 == "local" ]]; then
        _build_local
    else
        _build_docker "$1" "$2"
    fi
else

    echo Invalid number of arguments

    exit 1
fi
