const { execSync: exec } = require('child_process');

module.exports = {
  /**
   * Returns latest tag, sorted by version or null if no tag was found
   * @param prefix
   * @returns {string | null}
   */
  getLatestTag: (prefix) => {
    const maybeGrepCommand = prefix !== '' ? `| grep "^${prefix}"` : '';
    const stdout = exec(`git tag -l ${maybeGrepCommand} | sort -V | tail -n 1`);
    const lastTag = String(stdout).trim();
    return lastTag === '' ? null : lastTag;
  },
  /**
   * @param {string} tag
   */
  pushNewTag: (tag) => {
    try {
      exec(`git tag -am "${tag}" ${tag} && git push --tags`);
    } catch (e) {
      exec(`git tag -d ${tag} && git fetch --tags`);
      throw e;
    }
  },
};
