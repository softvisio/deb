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

    get config () {
        if ( !this.#config ) {
            this.#config = readConfig( env.root + "/config.yaml" );
        }

        return this.#config;
    }

    get supportedDists () {
        if ( !this.#supportedDists ) {
            this.#supportedDists = new Set( this.config.ssupportedDists );
        }

        return this.#supportedDists;
    }

    // public
}
