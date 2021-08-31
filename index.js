const core = require('@actions/core');
const { reportAction } = require('@gh-stats/reporter');
const action = require('./action');
const prefix = core.getInput('prefix');
const versioning = core.getInput('versioning');
const force = core.getInput('force');

reportAction();

const { currentTag, nextTag, nextVersion } = action({ prefix, versioning, force });
core.setOutput('current_tag', currentTag);
core.setOutput('next_tag', nextTag);
core.setOutput('next_version', nextVersion);

core.info(`Current tag: ${currentTag}`);
core.info(`Next tag: ${nextTag}`);
core.info(`Next version: ${nextVersion}`);
