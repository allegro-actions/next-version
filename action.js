const core = require('@actions/core');
const { increment } = require('./incrementer');
const { parse } = require('./tag-parser');

/**
 * @param step incrementation step
 * @param currentBranch current branch
 * @param latestTag latest tag
 * @param forceVersion forced version
 * @param type type of repo
 * @returns {Promise<unknown[]|{prefix, version: *}|{prefix: string, version}|{prefix: string, version: null}>}
 */
module.exports = async function action(step, currentBranch, latestTag, forceVersion = null, type = 'library') {

    if (forceVersion && parse(forceVersion, type).version){
        return forceVersion
    }

    if (!['patch', 'major', 'minor'].includes(step)) {
        throw new Error(`invalid step parameter, use 'patch', 'minor' or 'major', got '${step}'`);
    }

    if (!['library', 'service'].includes(type)) {
        throw new Error(`invalid type parameter, use 'library' or 'service', got '${type}'`);
    }

    const mainBranch = ['master', 'main'].includes(currentBranch);
    core.info(`current branch: ${currentBranch}`)
    core.info(`last tag found ${latestTag}`);

    if (!mainBranch) core.info('this is a snapshot release');
    if (latestTag) {
        const { prefix, version } = parse(latestTag, type)
        const result = increment(version, {
            step,
            prefix,
            suffix: mainBranch ? '' : `-${slugify(currentBranch)}-SNAPSHOT`
        },
            {type});
        if (result) {
            core.info(`next version: ${result}`);
            return result;
        }
    }

    core.info('no previous version found');
    if(type === 'library'){
      core.info(`next version: v1.0.0${mainBranch ? '' : '-SNAPSHOT'}`);
      return `v1.0.0${mainBranch ? '' : '-SNAPSHOT'}`;
    }

    if(type === 'service'){
      core.info(`next version: v1${mainBranch ? '' : '-SNAPSHOT'}`);
      return `v1${mainBranch ? '' : '-SNAPSHOT'}`;
    }
}

function isLibrary(type) {
    return type === 'library'
}

function slugify(input) {
    return input.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
