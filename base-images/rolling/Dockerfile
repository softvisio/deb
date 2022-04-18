FROM ubuntu:rolling

LABEL \
    org.opencontainers.image.source="https://github.com/softvisio/deb" \
    maintainer="zdm"

USER root

ENV DEBIAN_FRONTEND=noninteractive

ADD . /tmp/setup

WORKDIR /var/local

RUN \
    bash /tmp/setup/setup.sh \
    rm -rf /tmp/setup

ENTRYPOINT [ "/bin/bash", "-l" ]
