const action = require('./action');

describe('next-version action', () => {

    test('should validate step input value', () => {
        expect(action(undefined)).rejects.toThrowError();
        expect(action(null)).rejects.toThrowError();
        expect(action('')).rejects.toThrowError();
        expect(action('anything')).rejects.toThrowError();
    });

    test('should increment version for semver tag and main branch', async () => {
        // given
        const currentBranch = 'master';
        const latestTag = 'v1.0.0';

        // expect
        expect(await action('patch', currentBranch, latestTag)).toEqual('v1.0.1');
        expect(await action('minor', currentBranch, latestTag)).toEqual('v1.1.0');
        expect(await action('major', currentBranch, latestTag)).toEqual('v2.0.0');
    });

    test('should increment version for semver tag and not main branch', async () => {
        // given
        const currentBranch = 'branch';
        const latestTag = 'v1.0.0';

        // expect
        expect(await action('patch', currentBranch, latestTag)).toEqual('v1.0.1-branch-SNAPSHOT');
        expect(await action('minor', currentBranch, latestTag)).toEqual('v1.1.0-branch-SNAPSHOT');
        expect(await action('major', currentBranch, latestTag)).toEqual('v2.0.0-branch-SNAPSHOT');
    });

    test('should increment version for not semver tag and main branch', async () => {
        // given
        const currentBranch = 'master';
        const latestTag = 'opbox-1.0.0';

        // expect
        expect(await action('patch', currentBranch, latestTag)).toEqual('opbox-1.0.1');
        expect(await action('minor', currentBranch, latestTag)).toEqual('opbox-1.1.0');
        expect(await action('major', currentBranch, latestTag)).toEqual('opbox-2.0.0');
    });

    test('should increment version for not semver tag and not main branch', async () => {
        // given
        const currentBranch = 'branch';
        const latestTag = 'opbox-1.0.0';

        // expect
        expect(await action('patch', currentBranch, latestTag)).toEqual('opbox-1.0.1-branch-SNAPSHOT');
        expect(await action('minor', currentBranch, latestTag)).toEqual('opbox-1.1.0-branch-SNAPSHOT');
        expect(await action('major', currentBranch, latestTag)).toEqual('opbox-2.0.0-branch-SNAPSHOT');
    });

    test('should return first version (1.0.0) semver tag when no other tag found', async () => {
        // given
        const latestTag = '';

        // expect
        expect(await action('patch', 'master', latestTag)).toEqual('v1.0.0');
        expect(await action('patch', 'branch', latestTag)).toEqual('v1.0.0-SNAPSHOT');
    });

    test('should be able to force version', async () => {
        // given
        const latestTag = 'v1.0.0';

        // expect
        expect(await action('patch', 'master', latestTag, 'v5.0.0')).toEqual('v5.0.0');
        expect(await action('patch', 'branch', latestTag, 'v5.0.0')).toEqual('v5.0.0');
    });

    test('should return new version when tag is not recognized as a valid version tag', async () => {
        // given
        const latestTag = 'v1';

        // expect
        expect(await action('patch', 'master', latestTag)).toEqual('v1.0.0');
        expect(await action('patch', 'branch', latestTag)).toEqual('v1.0.0-SNAPSHOT');
    });

});
