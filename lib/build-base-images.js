import Command from "#lib/command";
import childProcess from "node:child_process";

export default class extends Command {
    #dists;

    constructor ( { dists } ) {
        super();

        this.#dists = dists;
    }

    // public
    async run () {
        const dists = this.getDists( this.#dists );

        for ( const dist of dists ) {
            const image = `ghcr.io/${ this.config.repo }:${ dist }`;

            var res;

            res = childProcess.spawnSync(
                "docker",
                [

                    //
                    `build`,
                    `--tag=${ image }`,
                    `--file=${ dist }/Dockerfile`,
                    `--pull`,
                    `--no-cache`,
                    `--shm-size=1g`,
                    `.`,
                ],
                {
                    "stdio": "inherit",
                    "cwd": this.resources + "/base-images",
                }
            );
            if ( res.status !== 0 ) return result( 500 );

            res = childProcess.spawnSync(
                "docker",
                [

                    //
                    `push`,
                    image,
                ],
                {
                    "stdio": "inherit",
                }
            );
            if ( res.status !== 0 ) return result( 500 );
        }

        return result( 200 );
    }
}
