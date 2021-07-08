const semver = require('semver')

module.exports = {
    /**
     * @param {string} version initial version.
     * @param {{step: ('patch'|'minor'|'major')},{prefix: string},{suffix: string}} config incrementer config.
     */
    increment: (version, config = { step: 'patch' }) => {
        const { prefix, suffix, step } = Object.assign({ prefix: '', suffix: '', step: 'patch' }, config);
        if (semver.valid(version)) {
            const nextVersion = semver.inc(version, step);
            return prefix + nextVersion + suffix;
        }
        return null;
    }
}
