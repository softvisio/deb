import Command from "#lib/command";

export default class extends Command {
    #dists;

    constructor ( { dists } ) {
        super();

        this.#dists = dists;
    }

    // public
    async run () {
        console.log( "---", this.supportedVersions );

        return result( 200 );
    }
}
