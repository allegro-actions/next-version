const generateTags = require('./generate-tags');
const gitCommands = require('./git-commands');
const { getLatestTag } = require('./git-commands');

/**
 @param {string} prefix
 @param {string} versioning
 @param {string} force
 @param {string} preReleaseSuffix
 @param {string} level
 @param {boolean} pushNewTag
 @param {number} retries
 @param {(string) => string | null} tagExtractor
 * @returns {GeneratedTags}
 */
module.exports = function action(
  { prefix, versioning, force, preReleaseSuffix, level, pushNewTag, retries },
  tagExtractor = getLatestTag,
) {
  let retriesLeft = clampRetries(retries);
  while (retriesLeft >= 0) {
    const tags = generateTags({ prefix, versioning, force, preReleaseSuffix, level }, tagExtractor);
    try {
      if (pushNewTag) {
        gitCommands.pushNewTag(tags.nextTag);
      }
      return tags;
    } catch (e) {
      if (retriesLeft > 0) {
        retriesLeft--;
      } else {
        throw e;
      }
    }
  }
  throw new Error(`Failed to generate tags in ${retries} retries`); // Should never occur
};
/**
 * @param {number} retries
 * @return {number}
 */
function clampRetries(retries) {
  return Math.max(0, Math.min(10, retries)) || 0;
}
