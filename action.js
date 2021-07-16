const semver = require('semver');
const { getLatestTag } = require('./git-commands');

/**
 * @param prefix
 * @param versioning
 * @param force
 * @param tagExtractor
 * @returns {string|*}
 */
module.exports = function action({ prefix = 'v', versioning = 'semver', force }, tagExtractor = getLatestTag) {

  const latestTag = tagExtractor(prefix);

  if (force) return { 'currentTag': latestTag || '', 'nextTag': prefix + force, 'nextVersion': force };

  if (!['semver', 'single-number'].includes(versioning)) {
    throw new Error(`unknown versioning '${versioning}'`);
  }

  if (latestTag === null) {
    switch (versioning) {
      case 'semver': {
        return { currentTag: '', nextTag: `${prefix}0.0.1`, nextVersion: '0.0.1' };
      }
      case 'single-number': {
        return { currentTag: '', nextTag: `${prefix}1`, nextVersion: '1' };
      }
    }
  }
  if (!latestTag.startsWith(prefix)) {
    throw new Error(`expecting provided tag ${latestTag} to start with ${prefix}`);
  }
  const version = latestTag.slice(prefix.length);

  switch (versioning) {
    case 'semver': {
      if (!semver.valid(version)) throw new Error(`version ${version} not a valid semver string`);
      return {
        currentTag: latestTag,
        nextTag: `${prefix}${semver.inc(version, 'patch')}`,
        nextVersion: semver.inc(version, 'patch')
      };
    }
    case 'single-number': {
      const versionInt = parseInt(version, 10);
      if (isNaN(versionInt)) throw new Error(`version ${version} not a valid number`);
      return { currentTag: latestTag, nextTag: `${prefix}${versionInt + 1}`, nextVersion: `${versionInt + 1}` };
    }
  }
};