#!/bin/bash

set -e

# POSTGRESQL_VERSION=16

apt-get update

apt-get install -y curl

source <(curl -fsSL https://raw.githubusercontent.com/softvisio/scripts/main/setup-host.sh)

apt-get install -y \
    apt-utils git gcc g++ make cmake libssl-dev gpg
# postgresql-server-dev-$POSTGRESQL_VERSION libkrb5-dev libipc-run-perl
