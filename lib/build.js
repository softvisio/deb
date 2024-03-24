import Command from "#lib/command";

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
        return result( 200 );
    }
}
