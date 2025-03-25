const semver = require('semver');
const {getLatestTag} = require('./git-commands');

/**
 * @param prefix
 * @param versioning
 * @param force
 * @param tagExtractor
 * @returns {string|*}
 */
module.exports = function action(
  {
    prefix = 'v',
    versioning = 'semver',
    force,
    preReleaseSuffix = '',
    level = 'patch',
    remoteTags = false
  },
  tagExtractor = getLatestTag
) {

  const latestTag = tagExtractor(prefix, remoteTags);
  const PRERELEASE_LEVEL_NAME = 'prerelease';

  if (force) return {'currentTag': latestTag || '', 'nextTag': prefix + force, 'nextVersion': force};

  if (!['semver', 'single-number'].includes(versioning)) {
    throw new Error(`unknown versioning '${versioning}'`);
  }

  if (!['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'].includes(level)) {
    throw new Error(`Invalid level name: ${level}`);
  }

  function isPreReleaseLevel() {
    return level === PRERELEASE_LEVEL_NAME;
  }

  if (isPreReleaseLevel() && preReleaseSuffix === '') {
    throw new Error(`There is no pre release suffix for level: ${level}`);
  }

  if (latestTag === null) {
    let calculatedPreReleaseVersion = isPreReleaseLevel() ? `-${preReleaseSuffix}.0` : '';
    let calculatedNextVersion = '';

    if (versioning === 'semver') calculatedNextVersion = `0.0.1${calculatedPreReleaseVersion}`;
    if (versioning === 'single-number') calculatedNextVersion = `1${calculatedPreReleaseVersion}`;

    return {
      currentTag: '',
      nextTag: `${prefix}${calculatedNextVersion}`,
      nextVersion: `${calculatedNextVersion}`
    };
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
        nextTag: `${prefix}${semver.inc(version, level, preReleaseSuffix)}`,
        nextVersion: semver.inc(version, level, preReleaseSuffix)
      };
    }
    case 'single-number': {
      let calculatedNextVersion = '';
      const isPreReleasedTag = version.includes('-' + preReleaseSuffix);

      const [singleNumberVersion, suffix] = version.split(`-${preReleaseSuffix}.`, 2);
      const nextPreReleaseVersion = suffix ? parseInt(suffix, 10) + 1 : 0;

      if (isPreReleasedTag && isPreReleaseLevel()) {
        calculatedNextVersion = `${singleNumberVersion}-${preReleaseSuffix}.${nextPreReleaseVersion}`;
      }

      if (isPreReleasedTag && !isPreReleaseLevel()) {
        calculatedNextVersion = parseInt(version, 10);
        if (isNaN(calculatedNextVersion)) throw new Error(`version ${version} not a valid number`);
      }

      if (!isPreReleasedTag && isPreReleaseLevel()) {
        calculatedNextVersion = `${parseInt(singleNumberVersion, 10) + 1}-${preReleaseSuffix}.${nextPreReleaseVersion}`;
      }

      if (!isPreReleasedTag && !isPreReleaseLevel()) {
        calculatedNextVersion = `${parseInt(singleNumberVersion, 10) + 1}`;
      }

      return {
        currentTag: latestTag,
        nextTag: `${prefix}${calculatedNextVersion}`,
        nextVersion: `${calculatedNextVersion}`
      };
    }
  }
};
