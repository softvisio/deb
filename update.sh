#!/bin/bash

set -u

apt install -y apt-utils git-filter-repo

SCRIPT_DIR="$(cd -P -- "$(dirname -- "$0")" && pwd -P)"

function _update() { (
    set -e

    for codename in focal impish; do
        mkdir -p dists/$codename/main/binary-all
        apt-ftparchive --arch all packages dists > dists/$codename/main/binary-all/Packages
        # cat dists/$codename/main/binary-all/Packages | gzip -9 > dists/$codename/main/binary-all/Packages.gz

        mkdir -p dists/$codename/main/binary-amd64
        apt-ftparchive --arch amd64 packages dists/$codename/main/binary-amd64 > dists/$codename/main/binary-amd64/Packages
        # cat dists/$codename/main/binary-amd64/Packages | gzip -9 > dists/$codename/main/binary-amd64/Packages.gz

        apt-ftparchive release -c=dists/$codename/aptftp.conf dists/$codename > dists/$codename/Release

        gpg --clearsign --yes -u zdm@softvisio.net -o dists/$codename/InRelease dists/$codename/Release
        rm -f dists/$codename/Release
    done

    git add .
    git ci -m"chore: dists update" -a

); }

function _prune() { (
    # set -e

    # remove files, that were deleted from dists
    git filter-repo --analyze

    tail +3 .git/filter-repo/analysis/path-deleted-sizes.txt | tr -s ' ' | cut -d ' ' -f 5- | grep -Pe ^dists/ > .git/filter-repo/analysis/path-deleted.txt

    # has files to prune
    if [ -s ".git/filter-repo/analysis/path-deleted.txt" ]; then
        echo Files to prune:
        cat .git/filter-repo/analysis/path-deleted.txt

        git filter-repo --force --partial --invert-paths --paths-from-file .git/filter-repo/analysis/path-deleted.txt
    else
        echo No files to prune
    fi

    # git garbage collection
    git reflog expire --expire-unreachable=now --all
    git gc --prune=now --aggressive
); }

pushd $SCRIPT_DIR

echo Updating ...
_update

if [[ $? != 0 ]]; then
    popd
    exit 1
fi

echo Prune ...
_prune

error=$?

rm -rf .git/filter-repo

if [[ $error == 0 ]]; then
    echo Pushing ...

    git push --force --all
    git push --force --tags
fi

popd
