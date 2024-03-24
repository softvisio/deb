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
        const dists = this.#dists || this.supportedDists;

        for ( const dist of dists ) {
            if ( !this.supportedDists.has( dist ) ) continue;

            const image = `ghcr.io/${ this.config.repo }:${ dist }`;

            childProcess.spawnSynv( "docker", [

                //
                `build`,
                `--tag=ghcr.io/${ image }`,
                `--file ${ dist }/Dockerfile`,
                `--pull`,
                `--no-cache`,
                `--shm-size=1g`,
                this.resources + "/base-images",
            ] );

            childProcess.spawnSynv( "docker", [

                //
                `push`,
                image,
            ] );
        }

        return result( 200 );
    }
}
