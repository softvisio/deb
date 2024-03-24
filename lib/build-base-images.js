import Command from "#lib/command";

export default class extends Command {
    #dists;

    constructor ( { dists } ) {
        super();

        this.#dists = dists;
    }

    // public
    async run () {
        return result( 200 );
    }
}
