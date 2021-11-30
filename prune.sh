#!/bin/bash

set -u

script_dir="$(cd -P -- "$(dirname -- "$0")" && pwd -P)"

apt install -y git-filter-repo

function _prune() { (
    set -e

    git filter-repo --force --partial --invert-paths --path dists

    git gc --prune=all --aggressive

    # git lfs prune

    # git -c gc.reflogExpire=0 -c gc.reflogExpireUnreachable=0 -c gc.rerereresolved=0 -c gc.rerereunresolved=0 -c gc.pruneExpire=now gc

    # git reflog expire --expire-unreachable=now --all
    # git gc --prune=now
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
