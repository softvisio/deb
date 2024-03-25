import "#core/result";
import { readConfig } from "#core/config";
import env from "#core/env";

export default class {
    #config;
    #supportedDists;

    // properties
    get root () {
        return env.root;
    }

    get resources () {
        return this.root + "/resources";
    }

    get config () {
        if ( !this.#config ) {
            this.#config = readConfig( this.resources + "/config.yaml" );
        }

        return this.#config;
    }

    // public
    getDists ( dists ) {
        this.#supportedDists ??= new Set( this.config.dists.map( dist => dist + "" ) );

        if ( !dists ) {
            return [ ...this.#supportedDists ];
        }
        else {
            return dists.filter( dist => this.#supportedDists.has( dist + "" ) );
        }
    }
}
