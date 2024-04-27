#!/bin/bash

# /bin/bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/apt/main/install.sh)

set -e

REPO_NAME=softvisio
REPO_SLUG=softvisio/apt/main
COMPONENT=main
VERSION_ID=$(. /etc/os-release && echo $VERSION_ID)

rm -rf /usr/share/keyrings/${REPO_NAME}-archive-keyring.gpg
rm -rf /etc/apt/sources.list.d/${REPO_NAME}.list

apt-get clean all

curl -fsSLo /usr/share/keyrings/${REPO_NAME}-archive-keyring.gpg https://raw.githubusercontent.com/$REPO_SLUG/dists/keyring.gpg

cat << EOF > /etc/apt/sources.list.d/${REPO_NAME}.list
deb [signed-by=/usr/share/keyrings/${REPO_NAME}-archive-keyring.gpg] https://raw.githubusercontent.com/$REPO_SLUG/ $VERSION_ID $COMPONENT

# deb [trusted=yes] https://raw.githubusercontent.com/$REPO_SLUG/ $VERSION_ID $COMPONENT
EOF
