const {execSync: exec} = require('child_process');

module.exports = {
  /*
   * Returns latest tag, sorted by version or null if no tag was found
   */
  getLatestTag: (prefix) => {
    const maybeGrepCommand = prefix !== '' ? `| grep "${prefix}*"` : '';
    const stdout = exec(`git tag -l ${maybeGrepCommand} | sort -V | tail -n 1`);
    const lastTag = String(stdout).trim();
    return lastTag === '' ? null : lastTag;
  }
};
