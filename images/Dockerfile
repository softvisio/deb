ARG FROM

FROM $FROM

USER root

ENV DEBIAN_FRONTEND=noninteractive

ADD . /tmp/setup

WORKDIR /var/local

RUN \
    bash /tmp/setup/setup.sh \
    rm -rf /tmp/setup

ENTRYPOINT [ "/bin/bash", "-l" ]
