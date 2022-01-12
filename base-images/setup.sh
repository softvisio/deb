#!/bin/bash

set -u
set -e

POSTGRESQL_VERSION=14

apt update

apt install -y curl

source <(curl -fsSL https://raw.githubusercontent.com/softvisio/scripts/main/setup-host.sh)

apt install -y \
    apt-utils git gcc g++ make cmake libssl-dev gpg \
    postgresql-server-dev-$POSTGRESQL_VERSION libkrb5-dev libipc-run-perl
