#!/bin/bash

set -u
set -e

apt update

apt install -y curl

source <(curl -fsSL https://raw.githubusercontent.com/softvisio/scripts/main/setup-host.sh)

apt install -y apt-utils git gcc g++ make cmake libssl-dev gpg
