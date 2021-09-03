const { execSync: exec } = require('child_process');

const TAG_NOT_FOUND = 128;

module.exports = {
  getLatestTag: (prefix) => {
    try {
      const stdout = exec(`git tag -l | grep "${prefix}*" | sort -V | tail -n 1`);
      return String(stdout).trim();
    } catch (error) {
      if (error.status === TAG_NOT_FOUND) return null;
      throw error;
    }
  }
};
