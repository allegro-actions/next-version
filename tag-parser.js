const semver = require('semver')
const EMPTY = { prefix: '', version: null };

module.exports = {
    /**
     * @param input tag to parse
     * @param {string} type incrementer type.
     * @returns {{prefix, version: *}|{prefix: string, version}|{prefix: string, version: null}}
     */
    parse: (input, type) => {
        if(type === 'library'){
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
        if(type === 'service'){
            if (!input) return EMPTY;
            if (input.match(/^v\d$/)) {
                const prefix = 'v';
                const version = input.split('v', 2)[1];
                return { prefix, version };
            }
            if(input.match(/^\d$/)){
                const prefix = ''
                const version = input
                return { prefix, version };
            }
            return EMPTY
        }
    }
}
