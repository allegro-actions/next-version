const {execSync: exec} = require('child_process');

module.exports = {
  /*
   * Returns latest tag, sorted by version or null if no tag was found
   */
  getLatestTag: (prefix) => {
    const maybeGrepCommand = prefix !== '' ? `| grep "^${prefix}"` : '';
    // sort -V doesn't handle suffixes
    // we want to keep the semantic order:
    // v1.0.0-alpha.0
    // v1.0.0-alpha.1
    // v1.0.0-rc.0
    // v1.0.0
    // v1.0.0-patch.0
    // https://stackoverflow.com/a/40391207
    const stdout = exec(`git tag -l ${maybeGrepCommand} | sed '/-/!{s/$/_/;}; s/-patch/_patch/' | sort -V | sed 's/_$//; s/_patch/-patch/' | tail -n 1`);
    const lastTag = String(stdout).trim();
    return lastTag === '' ? null : lastTag;
  }
};
