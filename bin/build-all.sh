#!/bin/bash

set -e

SCRIPT_DIR="$(cd -P -- "$(dirname -- "$0")" && pwd -P)"

pushd $SCRIPT_DIR

for spec in *.spec; do
    ./build.sh "$spec"
done

popd
