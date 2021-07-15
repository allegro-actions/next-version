const semver = require('semver')

module.exports = {
    /**
     * @param {string} version initial version.
     * @param {{step: ('patch'|'minor'|'major')},{prefix: string},{suffix: string}} config incrementer config.
     * @param {{type: ('library'|'service')}} type incrementer type.
     */
    increment: (version, config = { step: 'patch' }, type = { type: 'library'} ) => {
        const { prefix, suffix, step } = Object.assign({ prefix: '', suffix: '', step: 'patch' }, config);
        if ('library' === type.type){
            if (semver.valid(version)) {
                const nextVersion = semver.inc(version, step);
                return `${prefix}${nextVersion}${suffix}`
            }
        }
        if ('service' === type.type){
            return `${prefix}${++version}${suffix}`
        }
        return null;
    }
}
