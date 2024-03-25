import Command from "#lib/command";
import fs from "node:fs";

export default class extends Command {

    // public
    async run () {
        var res;

        res = this.installDeps();
        if ( !res.ok ) return res;

        for ( const dist of this.getDists().data ) {
            fs.mkdirSync( this.root + `/dists/${ dist }/main/binary-all`, {
                "recursive": true,
            } );

            res = this.spawnSync(
                "apt-ftparchive",
                [

                    //
                    "--arch=all",
                    "packages",
                    "dists",
                ],
                {
                    "stdio": "bind",
                }
            );
            if ( !res.ok ) return res;

            fs.writeFileSync( this.root + `/dists/${ dist }/main/binary-all/Packages`, res.data.stdout );

            // XXX
            // cat dists/$version/main/binary-all/Packages | gzip -9 > dists/$version/main/binary-all/Packages.gz

            fs.mkdirSync( this.root + `/dists/${ dist }/main/binary-amd64`, {
                "recursive": true,
            } );

            res = this.spawnSync(
                "apt-ftparchive",
                [

                    //
                    "--arch=amd64",
                    "packages",
                    `dists/${ dist }/main/binary-amd64`,
                ],
                {
                    "stdio": "bind",
                }
            );
            if ( !res.ok ) return res;

            fs.writeFileSync( this.root + `/dists/${ dist }/main/binary-amd64/Packages`, res.data.stdout );

            // XXX
            // cat dists/$version/main/binary-amd64/Packages | gzip -9 > dists/$version/main/binary-amd64/Packages.gz

            res = this.spawnSync(
                "apt-ftparchive",
                [

                    //
                    "release",
                    `-c=dists/${ dist }/aptftp.conf`,
                    `dists/${ dist }`,
                ],
                {
                    "stdio": "bind",
                }
            );
            if ( !res.ok ) return res;

            fs.writeFileSync( this.root + `/dists/${ dist }/Release`, res.data.stdout );

            res = this.spawnSync( "gpg", [

                //
                "--clearsign",
                "--yes",
                "-u",
                `zdm@softvisio.net`,
                "-o",
                this.root + `/dists/${ dist }/InRelease`,
                this.root + `/dists/${ dist }/Release`,
            ] );
            if ( !res.ok ) return res;

            fs.rmSync( this.root + `/dists/${ dist }/Release` );
        }

        res = this.spawnSync( "git", [ "add", "." ] );
        if ( !res.ok ) return res;

        res = this.spawnSync( "git", [ "commit", "-m", "chore: dists update", "-a" ] );
        if ( !res.ok ) return res;

        res = this.prune();
        if ( !res.ok ) return res;

        res = this.spawnSync( "git", [ "push", "--force", "--all" ] );
        if ( !res.ok ) return res;

        res = this.spawnSync( "git", [ "push", "--force", "--tags" ] );
        if ( !res.ok ) return res;

        return result( 200 );
    }

    installDeps () {
        return this.spawnSync( "apt-get", [

            //
            "install",
            "-y",
            "apt-utils",
            "git-filter-repo",
        ] );
    }

    prune () {
        var res;

        fs.rmSync( this.root + "/.git/filter-repo", {
            "recursive": true,
        } );

        // remove files, that were deleted from dists
        res = this.spawnSync( "git", [ "filter-repo", "--analyze" ] );
        if ( !res.ok ) return res;

        const deleted = fs
            .readFileSync( this.root + "/.git/filter-repo/analysis/path-deleted-sizes.txt", "utf8" )
            .split( "\n" )
            .slice( 2 )
            .map( line => line.replace( /\s+.+?\s+.+?\s+.+?\s+/, "" ) )
            .filter( line => line.startsWith( "dists/" ) );

        if ( !deleted.length ) return result( 200 );

        console.log( `Prune packages:`, deleted.join( ", " ) );

        res = this.spawnSync( "git", [ "filter-repo", "--force", "--partial", "--invert-paths", ...deleted.map( path => `--path=${ path }` ) ] );
        if ( !res.ok ) return res;

        // git garbage collection
        res = this.spawnSync( "git", [ "reflog", "expire", "--expire-unreachable=now", "--all" ] );
        if ( !res.ok ) return res;

        res = this.spawnSync( "git", [ "gc", "--prune=now", "--aggressive" ] );
        if ( !res.ok ) return res;

        return result( 200 );
    }
}
