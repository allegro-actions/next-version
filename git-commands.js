const {execSync: exec} = require('child_process');

module.exports = {
  /*
   * Returns latest tag, sorted by version or null if no tag was found
   */
  getLatestTag: (prefix) => {
    const stdout = exec(`git describe --match="${prefix}*"`);
    const lastTag = String(stdout).trim();
    return lastTag === '' ? null : lastTag;
  }
};
