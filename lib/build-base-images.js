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
        var res;

        res = this.getDists( this.#dists );
        if ( !res.ok ) return res;

        const dists = res.data;

        for ( const dist of dists ) {
            const image = `ghcr.io/${ this.config.repo }:${ dist }`;

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
