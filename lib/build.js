import Command from "#lib/command";
import glob from "#core/glob";
import childProcess from "node:child_process";

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

        const dists = this.#dists || this.supportedDists;

        for ( const pkg of packages ) {

            // XXX
            const arch = "all";

            if ( arch === "all" ) {
                const res = childProcess.spawnSync( this.resources + "/build.sh", [ pkg ], {
                    "stdio": "inherit",
                    "cwf": this.root,
                } );

                if ( res.status ) return result( 500 );
            }
            else {
                for ( const dist of dists ) {
                    if ( !this.supportedDists.has( dist ) ) continue;

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

                    if ( res.status ) return result( 500 );
                }
            }
        }

        return result( 200 );
    }
}
