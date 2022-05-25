#!/bin/bash
# vim: ft=sh

NAME=n
EPOCH=1
VERSION=$(git ls-remote --tags https://github.com/tj/n.git | perl -lne 'm[refs/tags/v([\d.]+)$]sm ? print $1 : next' | sort -V | tail -n 1)
REVISION=7
ARCHITECTURE=all
DEPENDS=
DESCRIPTION="Node version management"
N_PREFIX=/usr/n

function build() {
    mkdir -p ${DESTDIR}${N_PREFIX}
    curl -fsSL https://github.com/tj/n/archive/refs/tags/v${VERSION}.tar.gz | tar -C ${DESTDIR}${N_PREFIX} --strip-components=1 -xz

    mkdir -p $DESTDIR/etc/profile.d
    cat << EOF > $DESTDIR/etc/profile.d/n.sh
#!/bin/sh

export N_PREFIX=/usr/n
export NODE_OPTIONS="--trace-warnings --trace-uncaught"

NPM_PREFIX=\$(realpath ~)/.npm/bin

[[ :\$PATH: == *":\$NPM_PREFIX:"* ]] || PATH="\$NPM_PREFIX:\$PATH"

[[ :\$PATH: == *":\$N_PREFIX/bin:"* ]] || PATH+=":\$N_PREFIX/bin"
EOF
}
