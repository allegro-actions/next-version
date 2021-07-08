const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
    /**
     * @returns {Promise<*|string>}
     */
    getLatestTag: async () => {
        const {
            stdout: latestTagCommandOutput,
            error: latestTagCommandError
        } = await exec('git describe --match "*[0-9].*[0-9].*[0-9]*" --abbrev=0 --tags')
        if (latestTagCommandError) {
            throw new Error(`git command error: ${latestTagCommandError}`)
        }
        return latestTagCommandOutput.trim();
    }
}