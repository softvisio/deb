FROM ubuntu:latest

LABEL maintainer="zdm"

USER root

ADD . /tmp/setup

WORKDIR /var/local

RUN \
    bash /tmp/setup/setup.sh \
    rm -rf /tmp/setup

ENTRYPOINT [ "/bin/bash", "-l" ]
