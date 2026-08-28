#!/usr/bin/env -S bash

# script=$(curl -fsSL "https://raw.githubusercontent.com/softvisio/deb-repository/main/setup.sh")
#
# install
# bash <(echo "$script") install
#
# remove
# bash <(echo "$script") remove

set -Eeuo pipefail
trap 'echo "⚠  Error ($0:$LINENO, exit code: $?): $BASH_COMMAND" >&2' ERR

repo_name=softvisio
repo_slug=softvisio/deb-repository
component=main
version_id=$(. /etc/os-release && echo $VERSION_ID)

function _remove() {
    rm -rf /usr/share/keyrings/${repo_name}-archive-keyring.gpg
    rm -rf /etc/apt/sources.list.d/${repo_name}.list

    apt-get clean all

}

function _install() {
    apt-get install -y gpg

    curl -fsSL "https://raw.githubusercontent.com/$repo_slug/main/public-key.asc" | gpg --dearmor -o "/usr/share/keyrings/${repo_name}-archive-keyring.gpg"

    # deb [trusted=yes] https://raw.githubusercontent.com/$repo_slug/ $version_id $component

    cat << EOF > "/etc/apt/sources.list.d/${repo_name}.list"
deb [signed-by=/usr/share/keyrings/${repo_name}-archive-keyring.gpg] https://raw.githubusercontent.com/$repo_slug/ $version_id $component
EOF

}

case "${1:-}" in
    install)
        _remove
        _install
        ;;

    remove)
        _remove
        ;;

    *)
        return 1
        ;;
esac
