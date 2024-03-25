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
            return result( 200, [ ...this.#supportedDists ] );
        }
        else {
            for ( const dist of dists ) {
                if ( !this.#supportedDists.has( dist + "" ) ) return result( [ 400, `Dist "${ dist }" is not supported` ] );
            }

            return result( 200, dists );
        }
    }
}
