const core = require('@actions/core');
const { execSync: exec } = require('child_process');

const currentVersion = require('./package.json').version;
const versionList = JSON.parse(exec('npm view . versions --json', { encoding: 'utf-8' }));
const betaCounter = versionList
  .filter(version => version.startsWith(`${currentVersion}-beta.`))
  .length;

const nextBetaVersion = `${currentVersion}-beta.${betaCounter + 1}`;

core.setOutput('next_beta_version', nextBetaVersion);
