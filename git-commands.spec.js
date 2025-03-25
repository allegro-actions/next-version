const child_process = require('node:child_process');

describe('git-commands', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getLatestTag', () => {
    it('should return the latest tag without prefix or using remote', () => {
      const tag = 'v11.10423.1-RC.2';
      const spy = jest.spyOn(child_process, 'execSync')
          .mockImplementation(() => Buffer.from(tag, 'utf-8'));

      const latestTag = require('./git-commands').getLatestTag('');

      expect(latestTag).toBe(tag);
      expect(spy).toBeCalledWith('git tag -l  | sed \'/-/!{s/$/_/;}; s/-patch/_patch/\' | sort -V | sed \'s/_$//; s/_patch/-patch/\' | tail -n 1');
    });

    it('should return the latest tag with prefix', () => {
      const tag = 'v11.10423.1-RC.2';
      const spy = jest.spyOn(child_process, 'execSync')
          .mockImplementation(() => Buffer.from(tag, 'utf-8'));

      const latestTag = require('./git-commands').getLatestTag('v');

      expect(latestTag).toBe(tag);
      expect(spy).toBeCalledWith('git tag -l | grep "^v" | sed \'/-/!{s/$/_/;}; s/-patch/_patch/\' | sort -V | sed \'s/_$//; s/_patch/-patch/\' | tail -n 1');
    });

    it('should return the latest tag using remote tags', () => {
      const tag = 'v11.10423.1-RC.2';
      const spy = jest.spyOn(child_process, 'execSync')
          .mockImplementation(() => Buffer.from(tag, 'utf-8'));

      const latestTag = require('./git-commands').getLatestTag('', true);

      expect(latestTag).toBe(tag);
      expect(spy).toBeCalledWith('git ls-remote --tags --refs origin | cut -d\'/\' -f3  | sed \'/-/!{s/$/_/;}; s/-patch/_patch/\' | sort -V | sed \'s/_$//; s/_patch/-patch/\' | tail -n 1');
    });

    it('should return the latest tag with prefix using remote tags', () => {
      const tag = 'v11.10423.1-RC.2';
      const spy = jest.spyOn(child_process, 'execSync')
          .mockImplementation(() => Buffer.from(tag, 'utf-8'));

      const latestTag = require('./git-commands').getLatestTag('v', true);

      expect(latestTag).toBe(tag);
      expect(spy).toBeCalledWith('git ls-remote --tags --refs origin | cut -d\'/\' -f3 | grep "^v" | sed \'/-/!{s/$/_/;}; s/-patch/_patch/\' | sort -V | sed \'s/_$//; s/_patch/-patch/\' | tail -n 1');
    });
  });
});
