#!/usr/bin/env node

import Cli from "#core/cli";
import Build from "#lib/build";
import Update from "#lib/update";

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

var command;

if ( process.cli.command === "build" ) {
    command = new Build( {
        "packageSpec": process.cli.arguments.package,
        "dists": process.cli.options.dist,
    } );
}
else if ( process.cli.command === "update" ) {
    command = new Update();
}

await command.run();
