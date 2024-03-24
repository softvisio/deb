import Command from "#lib/command";
import glob from "#core/glob";

export default class extends Command {
    #packageSpec;
    #dists;

    constructor ( { packageSpec, dists } ) {
        super();

        this.#packageSpec = packageSpec;
        this.#dists = dists;
    }

    // public
    //
    async run () {
        var packages;

        if ( this.#packageSpec === "all" ) {
            packages = glob( "*.*", {
                "cwd": this.resources + "/packages",
            } ).filter( name => !name.endsWith( ".disabled" ) );
        }
        else {
            packages = [ this.#packageSpec ];
        }

        const dists = this.#dists || this.supportedDists;

        for ( const pkg of packages ) {
            for ( const dist of dists ) {
                if ( !this.supportedDists.has( dist ) ) continue;

                console.log( pkg, dist );
            }
        }

        return result( 200 );
    }
}
