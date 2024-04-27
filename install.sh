#!/bin/bash

# /bin/bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/apt/main/install.sh)

set -e

rm -rf /etc/apt/sources.list.d/softvisio.list

apt-get clean all

curl -fsSLo /usr/share/keyrings/softvisio-archive-keyring.gpg https://raw.githubusercontent.com/softvisio/apt/main/dists/keyring.gpg

cat << EOF > /etc/apt/sources.list.d/softvisio.list
# deb [trusted=yes] https://raw.githubusercontent.com/softvisio/apt/main/ $(. /etc/os-release && echo $VERSION_ID) main
deb [signed-by=/usr/share/keyrings/softvisio-archive-keyring.gpg] https://raw.githubusercontent.com/softvisio/apt/main/ $(. /etc/os-release && echo $VERSION_ID) main
EOF
