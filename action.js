const core = require('@actions/core');
const { increment } = require('./incrementer');
const { parse } = require('./tag-parser');

/**
 * @param step incrementation step
 * @param currentBranch current branch
 * @param latestTag latest tag
 * @param forceVersion forced version
 * @returns {Promise<unknown[]|{prefix, version: *}|{prefix: string, version}|{prefix: string, version: null}>}
 */
module.exports = async function action(step, currentBranch, latestTag, forceVersion = null) {

    if (forceVersion && parse(forceVersion).version) {
        return forceVersion;
    }

    if (!['patch', 'major', 'minor'].includes(step)) {
        throw new Error(`invalid step parameter, use 'patch', 'minor' or 'major', got '${step}'`);
    }

    const mainBranch = ['master', 'main'].includes(currentBranch);
    core.info(`current branch: ${currentBranch}`)
    core.info(`last tag found ${latestTag}`);

    if (!mainBranch) core.info('this is a snapshot release');
    if (latestTag) {
        const { prefix, version } = parse(latestTag);
        const result = increment(version, {
            step,
            prefix,
            suffix: mainBranch ? '' : `-${slugify(currentBranch)}-SNAPSHOT`
        });
        if (result) {
            core.info(`next version: ${result}`);
            return result;
        }
    }

    core.info('no previous version found');
    core.info(`next version: v1.0.0${mainBranch ? '' : '-SNAPSHOT'}`);

    return `v1.0.0${mainBranch ? '' : '-SNAPSHOT'}`;
}

function slugify(input) {
    return input.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}