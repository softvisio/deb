#!/bin/bash
# vim: ft=sh

NAME=repo-docker
EPOCH=1
VERSION=1.0.0
REVISION=1
ARCHITECTURE=all
DEPENDS=
DESCRIPTION="Official latest Docker-CE repository"

function build() {
    cat << EOF > $DEBIAN/postinst
#!/bin/bash

VERSION_CODENAME=\$(source /etc/os-release && echo \$VERSION_CODENAME)

sed -i -e "/ARCH/ s/ARCH/\$(dpkg --print-architecture)/" /etc/apt/sources.list.d/docker.list
sed -i -e "/VERSION_CODENAME/ s/VERSION_CODENAME/\$VERSION_CODENAME/" /etc/apt/sources.list.d/docker.list
EOF
    chmod +x $DEBIAN/postinst

    # install
    apt-get install -y gpg

    mkdir -p $DESTDIR/usr/share/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o $DESTDIR/usr/share/keyrings/docker-archive-keyring.gpg

    mkdir -p $DESTDIR/etc/apt/sources.list.d
    cat << EOF > $DESTDIR/etc/apt/sources.list.d/docker.list
deb [arch=ARCH signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu VERSION_CODENAME stable
EOF
}
