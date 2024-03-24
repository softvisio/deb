export default class {
    #packageSpec;
    #dists;

    constructor ( { packageSpec, dists } ) {
        this.#packageSpec = packageSpec;
        this.#dists = dists;
    }

    // public
    async run () {}
}
