jest.mock('./generate-tags', () => jest.fn());
jest.mock('./git-commands', () => ({
  pushNewTag: jest.fn()
}));

const action = require('./action');
const generateTags = require('./generate-tags');
const generateTagsMock = jest.mocked(generateTags);
const gitCommands = require('./git-commands');
const pushNewTagMock = jest.mocked(gitCommands.pushNewTag);

const tagExtractorParams = {
  prefix: 'my-prefix',
  versioning: 'my-version',
  force: 'my-force',
  preReleaseSuffix: 'my-pre-release-suffix',
  level: 'my-level',
};

const correctlyGeneratedTags = {
  'currentTag': 'test-1',
  'nextTag': 'test-2',
  'nextVersion': 'test-3'
};

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should pass most of the parameters to generate-tags and return its result', () => {
    const tagExtractor = jest.fn();
    generateTagsMock.mockReturnValueOnce(correctlyGeneratedTags);
    const result = action({...tagExtractorParams, pushNewTag: false, retries: 0}, tagExtractor);

    expect(generateTagsMock).toBeCalledWith(expect.objectContaining(tagExtractorParams), tagExtractor);
    expect(result).toBe(correctlyGeneratedTags);
  });

  test('should not push new tag when pushNewTag is false', () => {
    action({...tagExtractorParams, pushNewTag: false, retries: 0});

    expect(pushNewTagMock).not.toHaveBeenCalled();
  });

  test('should push new tag when pushNewTag is true', () => {
    generateTagsMock.mockReturnValueOnce({
      nextTag: 'next-tag',
    });
    action({...tagExtractorParams, pushNewTag: true, retries: 0});

    expect(pushNewTagMock).toHaveBeenCalledWith('next-tag');
  });

  test('should not retry when retries is > 1 but pushNewTag didn\'t throw', () => {
    generateTagsMock.mockReturnValueOnce({ nextTag: 'next-tag' });
    action({...tagExtractorParams, pushNewTag: true, retries: 100});

    expect(generateTagsMock).toHaveBeenCalledTimes(1);
    expect(pushNewTagMock).toHaveBeenCalledTimes(1);
  });

  test('should throw when couldn\'t push new tag and retries is 0', () => {
    generateTagsMock.mockReturnValueOnce({ nextTag: 'next-tag' });
    const error = new Error();
    pushNewTagMock.mockImplementationOnce(() => { throw error; });

    expect(() => action({...tagExtractorParams, pushNewTag: true, retries: 0})).toThrowError(error);

    expect(generateTagsMock).toHaveBeenCalledTimes(1);
    expect(pushNewTagMock).toHaveBeenCalledTimes(1);
  });

  test('should success if push has succeeded after initially throwing an error while retries is > 0', () => {
    generateTagsMock.mockReturnValueOnce({ nextTag: 'next-tag-1' });
    generateTagsMock.mockReturnValueOnce(correctlyGeneratedTags);
    pushNewTagMock.mockImplementationOnce(() => { throw new Error(); });

    const result = action({...tagExtractorParams, pushNewTag: true, retries: 1});

    expect(result).toBe(correctlyGeneratedTags);
  });

  test('should give up after 10 retries if push new tag always throws', () => {
    generateTagsMock.mockReturnValue({ nextTag: 'next-tag-1' });
    pushNewTagMock.mockImplementation(() => { throw new Error(); });

    expect(() => action({...tagExtractorParams, pushNewTag: true, retries: 999})).toThrowError();

    expect(generateTagsMock).toHaveBeenCalledTimes(11);
    expect(pushNewTagMock).toHaveBeenCalledTimes(11);
  });

  test('should execute once when reties is < 0', () => {
    generateTagsMock.mockReturnValue({ nextTag: 'next-tag-1' });
    pushNewTagMock.mockImplementation(() => { throw new Error(); });

    expect(() => action({...tagExtractorParams, pushNewTag: true, retries: -1})).toThrowError();

    expect(generateTagsMock).toHaveBeenCalledTimes(1);
    expect(pushNewTagMock).toHaveBeenCalledTimes(1);
  });

  test('should execute once when reties is NaN', () => {
    generateTagsMock.mockReturnValue({ nextTag: 'next-tag-1' });
    pushNewTagMock.mockImplementation(() => { throw new Error(); });

    expect(() => action({...tagExtractorParams, pushNewTag: true, retries: NaN})).toThrowError();

    expect(generateTagsMock).toHaveBeenCalledTimes(1);
    expect(pushNewTagMock).toHaveBeenCalledTimes(1);
  });
});
