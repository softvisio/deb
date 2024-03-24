#!/usr/bin/env node

import Cli from "#core/cli";
import Build from "#lib/build";
import Update from "#lib/update";
import BuildBaseImages from "#lib/build-base-images";

const CLI = {
    "title": `Debian packages repository manager`,

    "commands": {
        "build": {
            "short": "b",
            "title": `build deb package`,
            "options": {
                "dist": {
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

        "build-base-images": {
            "short": "B",
            "title": `build base images`,
            "options": {
                "dist": {
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
        },
    },
};

await Cli.parse( CLI );

var command;

if ( process.cli.command === "/build" ) {
    command = new Build( {
        "packageSpec": process.cli.arguments.package,
        "dists": process.cli.options.dist,
    } );
}
else if ( process.cli.command === "/update" ) {
    command = new Update();
}
else if ( process.cli.command === "/build-base-images" ) {
    command = new BuildBaseImages( {
        "dists": process.cli.options.dist,
    } );
}

const res = await command.run();

if ( !res.ok ) process.exit( 1 );
