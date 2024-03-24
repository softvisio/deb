import "#core/result";
import { readConfig } from "#core/config";
import env from "#core/env";

export default class {
    #supportedVersions;

    // properties
    get supportedVersions () {
        if ( !this.#supportedVersions ) {
            this.#supportedVersions = new Set( readConfig( env.root + "/versions.yank" ) );
        }

        return this.#supportedVersions;
    }
}
