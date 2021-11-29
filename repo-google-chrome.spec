#!/bin/bash
# vim: ft=sh

NAME=repo-google-chrome
EPOCH=1
VERSION=1.0.0
REVISION=1
ARCHITECTURE=all
DEPENDS=
DESCRIPTION="Official latest Google-Chrome repository"

function build() {
    apt install -y gpg

    mkdir -p $DESTDIR/usr/share/keyrings
    curl -fsSL https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o $DESTDIR/usr/share/keyrings/google-archive-keyring.gpg

    mkdir -p $DESTDIR/etc/apt/sources.list.d
    cat << EOF > $DESTDIR/etc/apt/sources.list.d/google-chrome.list
deb [signed-by=/usr/share/keyrings/google-archive-keyring.gpg] https://dl.google.com/linux/chrome/deb/ stable main
EOF
}
