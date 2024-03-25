import Command from "#lib/command";
import childProcess from "node:child_process";
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

            res = childProcess.spawnSync(
                "apt-ftparchive",
                [

                    //
                    "--arch=all",
                    "packages",
                    "dists",
                ],
                {
                    "cwd": this.root,
                }
            );
            if ( res.status !== 0 ) return result( 500 );

            fs.writeFileSync( this.root + `/dists/${ dist }/main/binary-all/Packages`, res.stdout );

            // XXX
            // cat dists/$version/main/binary-all/Packages | gzip -9 > dists/$version/main/binary-all/Packages.gz

            fs.mkdirSync( this.root + `/dists/${ dist }/main/binary-amd64`, {
                "recursive": true,
            } );

            res = childProcess.spawnSync(
                "apt-ftparchive",
                [

                    //
                    "--arch=amd64",
                    "packages",
                    `dists/${ dist }/main/binary-amd64`,
                ],
                {
                    "cwd": this.root,
                }
            );
            if ( res.status !== 0 ) return result( 500 );

            fs.writeFileSync( this.root + `/dists/${ dist }/main/binary-amd64/Packages`, res.stdout );

            // XXX
            // cat dists/$version/main/binary-amd64/Packages | gzip -9 > dists/$version/main/binary-amd64/Packages.gz

            res = childProcess.spawnSync(
                "apt-ftparchive",
                [

                    //
                    "release",
                    `-c=dists/${ dist }/aptftp.conf`,
                    `dists/${ dist }`,
                ],
                {
                    "cwd": this.root,
                }
            );
            if ( res.status !== 0 ) return result( 500 );

            fs.writeFileSync( this.root + `/dists/${ dist }/Release`, res.stdout );

            res = childProcess.spawnSync(
                "gpg",
                [

                    //
                    "--clearsign",
                    "--yes",
                    "-u",
                    `zdm@softvisio.net`,
                    "-o",
                    this.root + `/dists/${ dist }/InRelease`,
                    this.root + `/dists/${ dist }/Release`,
                ],
                {
                    "cwd": this.root,
                    "stdio": "ignore",
                }
            );
            if ( res.status !== 0 ) return result( 500 );

            fs.rmSync( this.root + `/dists/${ dist }/Release` );
        }

        res = childProcess.spawnSync( "git", [ "add", "." ], {
            "cwd": this.root,
            "stdio": "ignore",
        } );
        if ( res.status !== 0 ) return result( 500 );

        res = childProcess.spawnSync( "git", [ "commit", "-m", "chore: dists update", "-a" ], {
            "cwd": this.root,
            "stdio": "ignore",
        } );
        if ( res.status !== 0 ) return result( 500 );

        res = this.prune();
        if ( !res.ok ) return res;

        res = childProcess.spawnSync( "git", [ "push", "--force", "--all" ], {
            "cwd": this.root,
            "stdio": "ignore",
        } );
        if ( res.status !== 0 ) return result( 500 );

        res = childProcess.spawnSync( "git", [ "push", "--force", "--tags" ], {
            "cwd": this.root,
            "stdio": "ignore",
        } );
        if ( res.status !== 0 ) return result( 500 );

        return result( 200 );
    }

    installDeps () {
        const res = childProcess.spawnSync(
            "apt-get",
            [

                //
                "install",
                "-y",
                "apt-utils",
                "git-filter-repo",
            ],
            {
                "stdio": "ignore",
            }
        );
        if ( res.status !== 0 ) return result( 500 );

        return result( 200 );
    }

    prune () {
        var res;

        fs.rmSync( this.root + "/.git/filter-repo", {
            "recursive": true,
        } );

        // remove files, that were deleted from dists
        res = childProcess.spawnSync( "git", [ "filter-repo", "--analyze" ], {
            "cwd": this.root,
            "stdio": "ignore",
        } );
        if ( res.status !== 0 ) return result( 500 );

        const deleted = fs
            .readFileSync( this.root + "/.git/filter-repo/analysis/path-deleted-sizes.txt", "utf8" )
            .split( "\n" )
            .slice( 2 )
            .map( line => line.replace( /\s+.+?\s+.+?\s+.+?\s+/, "" ) )
            .filter( line => line.startsWith( "dists/" ) );

        if ( !deleted.length ) return result( 200 );

        console.log( `Prune packages:`, deleted.join( ", " ) );

        res = childProcess.spawnSync( "git", [ "filter-repo", "--force", "--partial", "--invert-paths", ...deleted.map( path => `--path=${ path }` ) ], {
            "cwd": this.root,
            "stdio": "ignore",
        } );
        if ( res.status !== 0 ) return result( 500 );

        // git garbage collection
        res = childProcess.spawnSync( "git", [ "reflog", "expire", "--expire-unreachable=now", "--all" ], {
            "cwd": this.root,
            "stdio": "ignore",
        } );
        if ( res.status !== 0 ) return result( 500 );

        res = childProcess.spawnSync( "git", [ "gc", "--prune=now", "--aggressive" ], {
            "cwd": this.root,
            "stdio": "ignore",
        } );
        if ( res.status !== 0 ) return result( 500 );

        return result( 200 );
    }
}
