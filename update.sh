#!/bin/bash

set -u
set -e

# apt install -y apt-utils

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
git push
