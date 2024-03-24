#!/usr/bin/env node

import Cli from "#core/cli";

const CLI = {
    "title": `Debian packages repository manager`,

    "commands": {
        "build": {
            "title": `build deb package`,
        },

        "update": {
            "title": `Update deb repository`,
        },
    },
};

await Cli.parse( CLI );
