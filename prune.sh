#!/bin/bash

set -u

script_dir="$(cd -P -- "$(dirname -- "$0")" && pwd -P)"

apt install -y git-filter-repo

function _prune() { (
    set -e

    git filter-repo --force --partial --invert-paths --path dists

    git gc --prune=all --aggressive

    # git lfs prune
); }

pushd $script_dir

mv dists dists-backup

_prune

error=$?

mv dists-backup dists

if [[ $error == 0 ]]; then
    git add dists

    git ci -m"chore: dists prune" -a

    git push --force --all
    git push --force --tags

fi

popd
