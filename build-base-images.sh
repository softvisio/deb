#!/bin/bash

set -e

SCRIPT_DIR="$(cd -P -- "$(dirname -- "$0")" && pwd -P)"

function _build_base_image() {
    docker build \
        --tag ghcr.io/softvisio/deb:$1 \
        --file $1/Dockerfile \
        --pull \
        --no-cache \
        --shm-size=1g \
        $SCRIPT_DIR/base-images

    docker push ghcr.io/softvisio/deb:$1
}

pushd $SCRIPT_DIR

while read codename; do
    _build_base_image $codename
done < "codenames.txt"

popd
