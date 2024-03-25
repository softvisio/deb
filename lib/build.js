import Command from "#lib/command";
import glob from "#core/glob";
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

        const res = this.getDists( this.#dists );
        if ( !res.ok ) return res;

        const dists = res.data;

        for ( const pkg of packages ) {
            if ( fs.readFileSync( this.resources + "/packages/" + pkg, "utf8" ).includes( "ARCHITECTURE=all" ) ) {
                const res = this.spawnSync( this.resources + "/build.sh", [ pkg ], {
                    "stdio": "inherit",
                } );
                if ( !res.ok ) return res;
            }
            else {
                for ( const dist of dists ) {
                    const res = this.spawnSync(
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
                        }
                    );

                    if ( !res.ok ) return res;
                }
            }
        }

        return result( 200 );
    }
}
