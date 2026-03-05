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
    calverFormat = 'YYYY.MM.MICRO',
    level = 'patch'
  },
  tagExtractor = getLatestTag,
  dateProvider = () => new Date()
) {

  const latestTag = tagExtractor(prefix);
  const PRERELEASE_LEVEL_NAME = 'prerelease';

  if (force) return {'currentTag': latestTag || '', 'nextTag': prefix + force, 'nextVersion': force};

  if (!['semver', 'single-number', 'calver'].includes(versioning)) {
    throw new Error(`unknown versioning '${versioning}'`);
  }

  if (!['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'].includes(level)) {
    throw new Error(`Invalid level name: ${level}`);
  }

  function isPreReleaseLevel() {
    return level === PRERELEASE_LEVEL_NAME;
  }

  const VALID_CALVER_FORMATS = ['YYYY.MM.MICRO', 'YY.MM.MICRO', 'YYYY.0M.MICRO', 'YY.0M.MICRO'];

  function getCalverFormatters() {
    if (!VALID_CALVER_FORMATS.includes(calverFormat)) {
      throw new Error(`Invalid calver format '${calverFormat}'. Valid formats: ${VALID_CALVER_FORMATS.join(', ')}`);
    }
    const useShortYear = calverFormat.startsWith('YY.');
    const usePaddedMonth = calverFormat.includes('.0M.');
    return {
      formatYear: (fullYear) => useShortYear ? fullYear % 100 : fullYear,
      formatMonth: (month) => usePaddedMonth ? String(month).padStart(2, '0') : month,
      toFullYear: (tagYear) => useShortYear ? 2000 + tagYear : tagYear
    };
  }

  if (isPreReleaseLevel() && preReleaseSuffix === '') {
    throw new Error(`There is no pre release suffix for level: ${level}`);
  }

  if (latestTag === null) {
    let calculatedPreReleaseVersion = isPreReleaseLevel() ? `-${preReleaseSuffix}.0` : '';
    let calculatedNextVersion = '';

    if (versioning === 'semver') calculatedNextVersion = `0.0.1${calculatedPreReleaseVersion}`;
    if (versioning === 'single-number') calculatedNextVersion = `1${calculatedPreReleaseVersion}`;
    if (versioning === 'calver') {
      const now = dateProvider();
      const { formatYear, formatMonth } = getCalverFormatters();
      calculatedNextVersion = `${formatYear(now.getFullYear())}.${formatMonth(now.getMonth() + 1)}.0${calculatedPreReleaseVersion}`;
    }

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
    case 'calver': {
      const now = dateProvider();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const { formatYear, formatMonth, toFullYear } = getCalverFormatters();

      const isPreReleasedTag = preReleaseSuffix !== '' && version.includes('-' + preReleaseSuffix);
      const [baseVersion, preSuffix] = version.split(`-${preReleaseSuffix}.`, 2);
      const [tagYearRaw, tagMonthRaw, tagMicro] = baseVersion.split('.').map(Number);
      const tagYear = toFullYear(tagYearRaw);
      const tagMonth = tagMonthRaw;
      const isSameMonth = year === tagYear && month === tagMonth;

      let calculatedNextVersion = '';

      if (isPreReleaseLevel()) {
        if (isPreReleasedTag && isSameMonth) {
          calculatedNextVersion = `${formatYear(tagYear)}.${formatMonth(tagMonth)}.${tagMicro}-${preReleaseSuffix}.${parseInt(preSuffix, 10) + 1}`;
        } else if (isSameMonth) {
          calculatedNextVersion = `${formatYear(year)}.${formatMonth(month)}.${tagMicro + 1}-${preReleaseSuffix}.0`;
        } else {
          calculatedNextVersion = `${formatYear(year)}.${formatMonth(month)}.0-${preReleaseSuffix}.0`;
        }
      } else {
        if (isPreReleasedTag && isSameMonth) {
          calculatedNextVersion = `${formatYear(tagYear)}.${formatMonth(tagMonth)}.${tagMicro}`;
        } else if (isSameMonth) {
          calculatedNextVersion = `${formatYear(year)}.${formatMonth(month)}.${tagMicro + 1}`;
        } else {
          calculatedNextVersion = `${formatYear(year)}.${formatMonth(month)}.0`;
        }
      }

      return {
        currentTag: latestTag,
        nextTag: `${prefix}${calculatedNextVersion}`,
        nextVersion: `${calculatedNextVersion}`
      };
    }
  }
};
