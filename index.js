const core = require('@actions/core');
const action = require('./action');
const prefix = core.getInput('prefix');
const versioning = core.getInput('versioning');
const force = core.getInput('force');
const preReleaseSuffix = core.getInput('pre-release-suffix');
const level = core.getInput('level');
const remoteTags = core.getInput('remote-tags');

const { currentTag, nextTag, nextVersion } = action({
    prefix,
    versioning,
    force,
    preReleaseSuffix,
    level,
    remoteTags,
});
core.setOutput('current_tag', currentTag);
core.setOutput('next_tag', nextTag);
core.setOutput('next_version', nextVersion);

core.info(`Current tag: ${currentTag}`);
core.info(`Next tag: ${nextTag}`);
core.info(`Next version: ${nextVersion}`);
