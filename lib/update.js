import Command from "#lib/command";
import childProcess from "node:child_process";

export default class extends Command {

    // public
    async run () {
        var res;

        res = childProcess.spawnSync(
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
