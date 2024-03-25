import Command from "#lib/command";
import glob from "#core/glob";
import childProcess from "node:child_process";
import fs from "node:fs";

export default class extends Command {
    #packageSpec;
    #dists;

    constructor ( { packageSpec, dists } ) {
        super();

        this.#packageSpec = packageSpec;
        this.#dists = dists;
    }

    // public
    async run () {
        var packages;

        if ( this.#packageSpec === "all" ) {
            packages = glob( "*", {
                "cwd": this.resources + "/packages",
            } ).filter( name => !name.endsWith( ".disabled" ) );
        }
        else {
            packages = [ this.#packageSpec ];
        }

        const dists = this.getDists( this.#dists );

        for ( const pkg of packages ) {
            if ( fs.readFileSync( this.resources + "/packages/" + pkg, "utf8" ).includes( "ARCHITECTURE=all" ) ) {
                const res = childProcess.spawnSync( this.resources + "/build.sh", [ pkg ], {
                    "stdio": "inherit",
                    "cwf": this.root,
                } );

                if ( res.status !== 0 ) return result( 500 );
            }
            else {
                for ( const dist of dists ) {
                    const res = childProcess.spawnSync(
                        "docker",
                        [

                            //
                            "run",
                            "-i",
                            "--shm-size=1g",
                            `-v=${ this.root }:/var/local`,
                            `--workdir=/var/local`,
                            `--entrypoint=/var/local/resources/build.sh`,
                            `ghcr.io/${ this.config.repo }:${ dist }`,
                            pkg,
                        ],
                        {
                            "stdio": "inherit",
                            "cwf": this.root,
                        }
                    );

                    if ( res.status !== 0 ) return result( 500 );
                }
            }
        }

        return result( 200 );
    }
}
