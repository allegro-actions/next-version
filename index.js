const core = require('@actions/core');
const { reportAction } = require('@gh-stats/reporter');
const action = require('./action');
const prefix = core.getInput('prefix');
const versioning = core.getInput('versioning');
const force = core.getInput('force');
const preReleaseSuffix = core.getInput('pre-release-suffix');
const level = core.getInput('level');
const pushNewTag = core.getBooleanInput('push-new-tag');
const retries = Number(core.getInput('retries'));

reportAction();

try {
    const {currentTag, nextTag, nextVersion} = action({ prefix, versioning, force, preReleaseSuffix, level, pushNewTag, retries });
    core.setOutput('current_tag', currentTag);
    core.setOutput('next_tag', nextTag);
    core.setOutput('next_version', nextVersion);

    core.info(`Current tag: ${currentTag}`);
    core.info(`Next tag: ${nextTag}`);
    core.info(`Next version: ${nextVersion}`);
} catch(e) {
    core.setFailed(e);
}
