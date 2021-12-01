#!/bin/bash

set -u

script_dir="$(cd -P -- "$(dirname -- "$0")" && pwd -P)"

apt install -y git-filter-repo

function _prune() { (
    set -e

    # remove files, that were deleted from dists
    git filter-repo --analyze

    tail +3 .git/filter-repo/analysis/path-deleted-sizes.txt | tr -s ' ' | cut -d ' ' -f 5- | grep -Pe ^dists/ > .git/filter-repo/analysis/path-deleted.txt

    cat .git/filter-repo/analysis/path-deleted.txt

    git filter-repo --force --partial --invert-paths --paths-from-file .git/filter-repo/analysis/path-deleted.txt

    # git garbage collection
    git reflog expire --expire-unreachable=now --all
    git gc --prune=now --aggressive
); }

pushd $script_dir

_prune

error=$?

rm -rf .git/filter-repo

if [[ $error == 0 ]]; then
    git ci -m"chore: dists prune" -a

    git push --force --all
    git push --force --tags

fi

popd
