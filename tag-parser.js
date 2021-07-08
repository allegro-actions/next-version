const semver = require('semver')
const EMPTY = { prefix: '', version: null };

module.exports = {
    /**
     * @param input tag to parse
     * @returns {{prefix, version: *}|{prefix: string, version}|{prefix: string, version: null}}
     */
    parse: (input) => {
        if (!input) return EMPTY;
        if (input.match(/^v\d/)) {
            const prefix = 'v';
            const version = input.split('v', 2)[1];
            if (!semver.valid(version)) return EMPTY;
            return { prefix, version };
        } else {
            const split = input.split(/(\d+\.\d+\.\d+)/, 3);
            const prefix = split[0];
            const version = split[1] + split[2];
            if (!semver.valid(version)) return EMPTY;
            return { prefix, version };
        }
    }
}
