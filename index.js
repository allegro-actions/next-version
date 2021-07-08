const core = require('@actions/core');
const action = require('./action');
const { getLatestTag, getCurrentBranch } = require('./git-commands');

process.on('unhandledRejection', up => {
    core.setFailed(`Action failed ${up}`);
});

(async () => {
    const step = core.getInput('step');
    const currentBranch = process.env['GITHUB_HEAD_REF'] || process.env['GITHUB_REF'].split('/').pop();
    const latestTag = await getLatestTag();
    const force = core.getInput('force');

    action(step, currentBranch, latestTag, force)
        .then(nextVersion => core.setOutput('version', nextVersion))
        .catch(reason => {
            core.setFailed(reason);
        });
})();