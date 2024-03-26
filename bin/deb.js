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
                "codename": {
                    "description": "ubuntu codename",
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
                    "description": `Pacjage to build. Use "all" to build all packages.`,
                    "required": true,
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
                "codename": {
                    "description": "ubuntu codename",
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
        "codenames": process.cli.options.codename,
    } );
}
else if ( process.cli.command === "/update" ) {
    command = new Update();
}
else if ( process.cli.command === "/build-base-images" ) {
    command = new BuildBaseImages( {
        "codename": process.cli.options.codename,
    } );
}

const res = await command.run();

if ( !res.ok ) {
    console.log( "Operation failed:", res + "" );

    process.exit( 1 );
}
