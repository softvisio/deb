#!/bin/bash
# vim: ft=sh

NAME=nvim
EPOCH=1

VERSION=$(git ls-remote --tags git://github.com/neovim/neovim.git | perl -lne 'm[refs/tags/v([\d.]+)$]sm ? print $1 : next' | sort -V | tail -n 1)
REVISION=1
ARCHITECTURE=all
DEPENDS=
DESCRIPTION="Neovim stable build"
PREFIX=/usr/local

function build() {
    mkdir -p ${DESTDIR}${PREFIX}
    curl -fsSL https://github.com/neovim/neovim/releases/download/stable/nvim-linux64.tar.gz | tar -C ${DESTDIR}${PREFIX} --strip-components=1 -xz
}
