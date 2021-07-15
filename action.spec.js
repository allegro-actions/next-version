const action = require('./action');

describe('next-version action', () => {

    test('should validate step input value', () => {
        expect(action(undefined)).rejects.toThrowError();
        expect(action(null)).rejects.toThrowError();
        expect(action('')).rejects.toThrowError();
        expect(action('anything')).rejects.toThrowError();
    });

    test('should validate type input value', () => {
        expect(action('major', 'master', 'v1', null, 'anything')).rejects.toThrowError();
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

    test('should increment version for non semver tag (type - service) and main branch', async () => {
        // given
        const currentBranch = 'master';
        const latestTag = '1';
        const result = '2'

        // expect
        expect(await action('major', currentBranch, latestTag, null, 'service')).toEqual(result);
        expect(await action('minor', currentBranch, latestTag, null, 'service')).toEqual(result);
        expect(await action('patch', currentBranch, latestTag, null, 'service')).toEqual(result);
    });

    test('should increment version for non semver tag (type - service) and not main branch', async () => {
        // given
        const currentBranch = 'branch';
        const latestTag = '1';
        const result = '2-branch-SNAPSHOT'

        // expect
        expect(await action('patch', currentBranch, latestTag, null, 'service')).toEqual(result);
        expect(await action('minor', currentBranch, latestTag, null, 'service')).toEqual(result);
        expect(await action('major', currentBranch, latestTag, null, 'service')).toEqual(result);
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

    test('should increment version for not semver tag (type - service) and not main branch', async () => {
        // given
        const currentBranch = 'branch';
        const latestTag = '1';
        const result = '2-branch-SNAPSHOT'

        // expect
        expect(await action('patch', currentBranch, latestTag, null, 'service')).toEqual(result);
        expect(await action('minor', currentBranch, latestTag, null, 'service')).toEqual(result);
        expect(await action('major', currentBranch, latestTag, null, 'service')).toEqual(result);
    });

    test('should return first version (1.0.0) semver tag when no other tag found', async () => {
        // given
        const latestTag = '';

        // expect
        expect(await action('patch', 'master', latestTag)).toEqual('v1.0.0');
        expect(await action('patch', 'branch', latestTag)).toEqual('v1.0.0-SNAPSHOT');
    });

    test('should return first version (1) tag when no other tag found', async () => {
        // given
        const latestTag = '';

        // expect
        expect(await action('major', 'master', latestTag, null, 'service')).toEqual('v1');
        expect(await action('major', 'branch', latestTag, null, 'service')).toEqual('v1-SNAPSHOT');
    });

    test('should be able to force version for type library', async () => {
        // given
        const latestTag = 'v1.0.0';

        // expect
        expect(await action('patch', 'master', latestTag, 'v5.0.0')).toEqual('v5.0.0');
        expect(await action('patch', 'branch', latestTag, 'v5.0.0')).toEqual('v5.0.0');
    });

    test('should be able to force version for type service', async () => {
        // given
        const latestTag = '1';

        // expect
        expect(await action('major', 'master', latestTag, '5', 'service')).toEqual('5');
        expect(await action('major', 'branch', latestTag, '5', 'service')).toEqual('5');
        expect(await action('major', 'master', latestTag, 'v5', 'service')).toEqual('v5');
        expect(await action('major', 'branch', latestTag, 'v5', 'service')).toEqual('v5');
    });

    test('should return new version when tag is not recognized as a valid version tag', async () => {
        // given
        const latestTag = 'v1';

        // expect
        expect(await action('patch', 'master', latestTag)).toEqual('v1.0.0');
        expect(await action('patch', 'branch', latestTag)).toEqual('v1.0.0-SNAPSHOT');
    });

});
