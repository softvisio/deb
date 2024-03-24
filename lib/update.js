import Command from "#lib/command";
import childProcess from "node:child_process";
import fs from "node:fs";

export default class extends Command {

    // public
    async run () {
        var res;

        // XXX
        // // res = this.installDeps();
        // if ( !res.ok ) return res;

        for ( const dist of this.supportedDists ) {
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
            if ( res.status ) return result( 500 );

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
            if ( res.status ) return result( 500 );

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
            if ( res.status ) return result( 500 );

            fs.writeFileSync( this.root + `/dists/${ dist }/Release`, res.stdout );

            // gpg --clearsign --yes -u zdm@softvisio.net -o dists/$version/InRelease dists/$version/Release

            // XXX
            // rm -f dists/$version/Release
            fs.rmSync( this.root + `/dists/${ dist }/Release` );
        }

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
                "stdio": "inherit",
            }
        );
        if ( res.status ) return result( 500 );

        return result( 200 );
    }
}
