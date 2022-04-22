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
        $SCRIPT_DIR

    docker push ghcr.io/softvisio/deb:$1
}

for codename in focal impish jammy; do
    _build_base_image $codename
done
