import "#core/result";
import { readConfig } from "#core/config";
import env from "#core/env";

export default class {
    #config;
    #supportedVersions;

    // properties
    get config () {
        if ( !this.#config ) {
            this.#config = readConfig( env.root + "/config.yaml" );
        }

        return this.#config;
    }

    get supportedVersions () {
        if ( !this.#supportedVersions ) {
            this.#supportedVersions = new Set( this.config.versions );
        }

        return this.#supportedVersions;
    }
}
