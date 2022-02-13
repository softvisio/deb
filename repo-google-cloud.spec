#!/bin/bash
# vim: ft=sh

NAME=repo-google-gloud
EPOCH=1
VERSION=1.0.0
REVISION=1
ARCHITECTURE=all
DEPENDS=
DESCRIPTION="Official latest Google Cloud repository"

function build() {
    apt install -y gpg

    mkdir -p $DESTDIR/usr/share/keyrings
    curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o $DESTDIR/usr/share/keyrings/google-cloud-archive-keyring.gpg

    mkdir -p $DESTDIR/etc/apt/sources.list.d
    cat << EOF > $DESTDIR/etc/apt/sources.list.d/google-cloud.list
deb [signed-by=/usr/share/keyrings/google-cloud-archive-keyring.gpg] https://packages.cloud.google.com/apt cloud-sdk main
EOF
}
