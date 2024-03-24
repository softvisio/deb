#!/usr/bin/env node

import Cli from "#core/cli";

const CLI = {
    "title": `Debian packages repository manager`,

    "commands": {
        "build": {
            "title": `build deb package`,

            "options": {
                "dost": {
                    "description": "ubuntu dist version",
                    "schema": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        },
                        "uniqueItems": true,
                    },
                },
            },

            "arguments": {
                "package": {
                    "description": "pacjage spec name",
                    "schema": {
                        "type": "string",
                    },
                },
            },
        },

        "update": {
            "title": `Update deb repository`,
        },
    },
};

await Cli.parse( CLI );

console.log( process.cli );
