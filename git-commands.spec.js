import { jest } from '@jest/globals';

describe('git-commands', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.unstable_unmockModule('node:child_process');
  });

  describe('getLatestTag', () => {
    it('should return the latest tag without prefix', async () => {
      const tag = 'v11.10423.1-RC.2';
      const execSync = jest.fn(() => Buffer.from(tag, 'utf-8'));
      jest.unstable_mockModule('node:child_process', () => ({ execSync }));
      const { getLatestTag } = await import('./git-commands.js');

      const latestTag = getLatestTag('');

      expect(latestTag).toBe(tag);
      expect(execSync).toHaveBeenCalledWith('(git ls-remote --tags --refs origin | cut -d\'/\' -f3 && git tag -l)  | sed \'/-/!{s/$/_/;}; s/-patch/_patch/\' | sort -V | sed \'s/_$//; s/_patch/-patch/\' | tail -n 1');
    });

    it('should return the latest tag with prefix', async () => {
      const tag = 'v11.10423.1-RC.2';
      const execSync = jest.fn(() => Buffer.from(tag, 'utf-8'));
      jest.unstable_mockModule('node:child_process', () => ({ execSync }));
      const { getLatestTag } = await import('./git-commands.js');

      const latestTag = getLatestTag('v');

      expect(latestTag).toBe(tag);
      expect(execSync).toHaveBeenCalledWith('(git ls-remote --tags --refs origin | cut -d\'/\' -f3 && git tag -l) | grep "^v" | sed \'/-/!{s/$/_/;}; s/-patch/_patch/\' | sort -V | sed \'s/_$//; s/_patch/-patch/\' | tail -n 1');
    });
  });
});
