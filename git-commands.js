const { execSync: exec } = require('child_process');

const TAG_NOT_FOUND = 128;

module.exports = {
  getLatestTag: (prefix) => {
    try {
      const stdout = exec(`git describe --match "${prefix}*" --abbrev=0 --tags`);
      return String(stdout).trim();
    } catch (error) {
      if (error.status === TAG_NOT_FOUND) return null;
      throw error;
    }
  }
};