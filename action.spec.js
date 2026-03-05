const action = require('./action');

describe('action', () => {

  test('increments version', () => {
    // expect
    expect(action({ versioning: 'semver' }, () => 'v1.0.0')).toEqual({
      'currentTag': 'v1.0.0',
      'nextTag': 'v1.0.1',
      'nextVersion': '1.0.1'
    });
    expect(action({ versioning: 'single-number' }, () => 'v1')).toEqual({
      'currentTag': 'v1',
      'nextTag': 'v2',
      'nextVersion': '2'
    });
  });

  test('increments pre release version', () => {
    // expect
    expect(action({ versioning: 'semver', preReleaseSuffix: 'RC', level: 'prerelease' }, () => 'v1.0.0')).toEqual({
      'currentTag': 'v1.0.0',
      'nextTag': 'v1.0.1-RC.0',
      'nextVersion': '1.0.1-RC.0'
    });
    expect(action({ versioning: 'single-number', preReleaseSuffix: 'RC', level: 'prerelease' }, () => 'v1')).toEqual({
      'currentTag': 'v1',
      'nextTag': 'v2-RC.0',
      'nextVersion': '2-RC.0'
    });
    expect(action({ versioning: 'semver', preReleaseSuffix: 'RC', level: 'prerelease' }, () => 'v1.0.0-RC.0')).toEqual({
      'currentTag': 'v1.0.0-RC.0',
      'nextTag': 'v1.0.0-RC.1',
      'nextVersion': '1.0.0-RC.1'
    });
    expect(action({ versioning: 'single-number', preReleaseSuffix: 'RC', level: 'prerelease' }, () => 'v1-RC.1')).toEqual({
      'currentTag': 'v1-RC.1',
      'nextTag': 'v1-RC.2',
      'nextVersion': '1-RC.2'
    });
  });

  test('remove pre release suffix for patch level', () => {
    // expect
    expect(action({ versioning: 'semver', preReleaseSuffix: 'RC', level: 'patch' }, () => 'v1.0.0-RC.1')).toEqual({
      'currentTag': 'v1.0.0-RC.1',
      'nextTag': 'v1.0.0',
      'nextVersion': '1.0.0'
    });
    expect(action({ versioning: 'single-number', preReleaseSuffix: 'RC', level: 'patch' }, () => 'v5-RC.1')).toEqual({
      'currentTag': 'v5-RC.1',
      'nextTag': 'v5',
      'nextVersion': '5'
    });
  });

  test('when there is no suffix for pre release', () => {
    // expect
    expect(() => action({  versioning: 'semver', preReleaseSuffix: '', level: 'prerelease'  }, () => 'v1.0.0-RC.0')).toThrowError();
    expect(() => action({  versioning: 'single-number', preReleaseSuffix: '', level: 'prerelease'  }, () => 'v1-RC.0')).toThrowError();
  });

  test('sets initial pre-release version when no release tag found', () => {
    // expect
    expect(action({ versioning: 'semver', preReleaseSuffix: 'RC', level: 'prerelease' }, () => null)).toEqual({
      'currentTag': '',
      'nextTag': 'v0.0.1-RC.0',
      'nextVersion': '0.0.1-RC.0'
    });
    expect(action({ versioning: 'single-number', preReleaseSuffix: 'RC', level: 'prerelease' }, () => null)).toEqual({
      'currentTag': '',
      'nextTag': 'v1-RC.0',
      'nextVersion': '1-RC.0'
    });
  });

  test('throws error when level is invalid', () => {
    // expect
    expect(() => action({ versioning: 'semver', preReleaseSuffix: 'RC', level: 'invalid' }, () =>  'v1.0.0-RC.0')).toThrowError();
    expect(() => action({ versioning: 'single-number', preReleaseSuffix: 'RC', level: 'invalid' }, () =>  'v1-RC.0')).toThrowError();
  });

  test('increments version with custom prefix', () => {
    // expect
    expect(action({
      prefix: 'prefix-',
      versioning: 'semver'
    }, () => 'prefix-1.0.0')).toEqual({
      'currentTag': 'prefix-1.0.0',
      'nextTag': 'prefix-1.0.1',
      'nextVersion': '1.0.1'
    });
    expect(action({
      prefix: 'prefix-',
      versioning: 'single-number'
    }, () => 'prefix-1')).toEqual({ 'currentTag': 'prefix-1', 'nextTag': 'prefix-2', 'nextVersion': '2' });
  });

  test('sets initial version when no release tag found', () => {
    // expect
    expect(action({ versioning: 'semver' }, () => null)).toEqual({
      'currentTag': '',
      'nextTag': 'v0.0.1',
      'nextVersion': '0.0.1'
    });
    expect(action({ versioning: 'single-number' }, () => null)).toEqual({
      'currentTag': '',
      'nextTag': 'v1',
      'nextVersion': '1'
    });
  });

  test('sets forced version when provided', () => {
    // expect
    expect(action({ force: '5.0.0', versioning: 'semver' }, () => 'v4.0.0')).toEqual({
      'currentTag': 'v4.0.0',
      'nextTag': 'v5.0.0',
      'nextVersion': '5.0.0'
    });
    expect(action({ force: '5', versioning: 'single-number' }, () => 'v3')).toEqual({
      'currentTag': 'v3',
      'nextTag': 'v5',
      'nextVersion': '5'
    });
  });

  test('when prefix does not match which tag', () => {
    // expect
    expect(() => action({ prefix: 'opbox-web' }, () => 'opbox-core-4.0.0')).toThrowError();
  });

  test('when prefix does not match which tag', () => {
    // expect
    expect(() => action({ versioning: 'custom' }, () => 'opbox-core-4.0.0')).toThrowError();
  });

  const march2025 = () => new Date(2025, 2, 15); // March 2025

  test('calver: increments micro version within same month', () => {
    expect(action({ versioning: 'calver' }, () => 'v2025.3.0', march2025)).toEqual({
      'currentTag': 'v2025.3.0',
      'nextTag': 'v2025.3.1',
      'nextVersion': '2025.3.1'
    });
    expect(action({ versioning: 'calver' }, () => 'v2025.3.5', march2025)).toEqual({
      'currentTag': 'v2025.3.5',
      'nextTag': 'v2025.3.6',
      'nextVersion': '2025.3.6'
    });
  });

  test('calver: resets micro on month change', () => {
    expect(action({ versioning: 'calver' }, () => 'v2025.2.5', march2025)).toEqual({
      'currentTag': 'v2025.2.5',
      'nextTag': 'v2025.3.0',
      'nextVersion': '2025.3.0'
    });
  });

  test('calver: resets micro on year change', () => {
    expect(action({ versioning: 'calver' }, () => 'v2024.12.3', march2025)).toEqual({
      'currentTag': 'v2024.12.3',
      'nextTag': 'v2025.3.0',
      'nextVersion': '2025.3.0'
    });
  });

  test('calver: sets initial version when no tag found', () => {
    expect(action({ versioning: 'calver' }, () => null, march2025)).toEqual({
      'currentTag': '',
      'nextTag': 'v2025.3.0',
      'nextVersion': '2025.3.0'
    });
  });

  test('calver: sets initial pre-release version when no tag found', () => {
    expect(action({ versioning: 'calver', preReleaseSuffix: 'RC', level: 'prerelease' }, () => null, march2025)).toEqual({
      'currentTag': '',
      'nextTag': 'v2025.3.0-RC.0',
      'nextVersion': '2025.3.0-RC.0'
    });
  });

  test('calver: increments pre-release version', () => {
    expect(action({ versioning: 'calver', preReleaseSuffix: 'RC', level: 'prerelease' }, () => 'v2025.3.0', march2025)).toEqual({
      'currentTag': 'v2025.3.0',
      'nextTag': 'v2025.3.1-RC.0',
      'nextVersion': '2025.3.1-RC.0'
    });
    expect(action({ versioning: 'calver', preReleaseSuffix: 'RC', level: 'prerelease' }, () => 'v2025.3.1-RC.0', march2025)).toEqual({
      'currentTag': 'v2025.3.1-RC.0',
      'nextTag': 'v2025.3.1-RC.1',
      'nextVersion': '2025.3.1-RC.1'
    });
  });

  test('calver: promotes pre-release to stable', () => {
    expect(action({ versioning: 'calver', preReleaseSuffix: 'RC', level: 'patch' }, () => 'v2025.3.1-RC.1', march2025)).toEqual({
      'currentTag': 'v2025.3.1-RC.1',
      'nextTag': 'v2025.3.1',
      'nextVersion': '2025.3.1'
    });
  });

  test('calver: resets pre-release on month change', () => {
    expect(action({ versioning: 'calver', preReleaseSuffix: 'RC', level: 'prerelease' }, () => 'v2025.2.1-RC.3', march2025)).toEqual({
      'currentTag': 'v2025.2.1-RC.3',
      'nextTag': 'v2025.3.0-RC.0',
      'nextVersion': '2025.3.0-RC.0'
    });
  });

  test('calver: promotes pre-release from old month to new stable', () => {
    expect(action({ versioning: 'calver', preReleaseSuffix: 'RC', level: 'patch' }, () => 'v2025.2.1-RC.0', march2025)).toEqual({
      'currentTag': 'v2025.2.1-RC.0',
      'nextTag': 'v2025.3.0',
      'nextVersion': '2025.3.0'
    });
  });

  test('calver: increments version with custom prefix', () => {
    expect(action({
      prefix: 'prefix-',
      versioning: 'calver'
    }, () => 'prefix-2025.3.0', march2025)).toEqual({
      'currentTag': 'prefix-2025.3.0',
      'nextTag': 'prefix-2025.3.1',
      'nextVersion': '2025.3.1'
    });
  });

  test('calver: YY.MM.MICRO format increments micro', () => {
    expect(action({ versioning: 'calver', calverFormat: 'YY.MM.MICRO' }, () => 'v25.3.0', march2025)).toEqual({
      'currentTag': 'v25.3.0',
      'nextTag': 'v25.3.1',
      'nextVersion': '25.3.1'
    });
  });

  test('calver: YY.MM.MICRO format resets micro on month change', () => {
    expect(action({ versioning: 'calver', calverFormat: 'YY.MM.MICRO' }, () => 'v25.2.5', march2025)).toEqual({
      'currentTag': 'v25.2.5',
      'nextTag': 'v25.3.0',
      'nextVersion': '25.3.0'
    });
  });

  test('calver: YY.MM.MICRO format initial version', () => {
    expect(action({ versioning: 'calver', calverFormat: 'YY.MM.MICRO' }, () => null, march2025)).toEqual({
      'currentTag': '',
      'nextTag': 'v25.3.0',
      'nextVersion': '25.3.0'
    });
  });

  test('calver: YY.MM.MICRO format pre-release', () => {
    expect(action({ versioning: 'calver', calverFormat: 'YY.MM.MICRO', preReleaseSuffix: 'RC', level: 'prerelease' }, () => 'v25.3.0', march2025)).toEqual({
      'currentTag': 'v25.3.0',
      'nextTag': 'v25.3.1-RC.0',
      'nextVersion': '25.3.1-RC.0'
    });
    expect(action({ versioning: 'calver', calverFormat: 'YY.MM.MICRO', preReleaseSuffix: 'RC', level: 'prerelease' }, () => 'v25.3.1-RC.0', march2025)).toEqual({
      'currentTag': 'v25.3.1-RC.0',
      'nextTag': 'v25.3.1-RC.1',
      'nextVersion': '25.3.1-RC.1'
    });
  });

  test('calver: YYYY.0M.MICRO format with zero-padded month', () => {
    expect(action({ versioning: 'calver', calverFormat: 'YYYY.0M.MICRO' }, () => 'v2025.03.0', march2025)).toEqual({
      'currentTag': 'v2025.03.0',
      'nextTag': 'v2025.03.1',
      'nextVersion': '2025.03.1'
    });
  });

  test('calver: YYYY.0M.MICRO format initial version', () => {
    expect(action({ versioning: 'calver', calverFormat: 'YYYY.0M.MICRO' }, () => null, march2025)).toEqual({
      'currentTag': '',
      'nextTag': 'v2025.03.0',
      'nextVersion': '2025.03.0'
    });
  });

  test('calver: YY.0M.MICRO format', () => {
    expect(action({ versioning: 'calver', calverFormat: 'YY.0M.MICRO' }, () => 'v25.03.2', march2025)).toEqual({
      'currentTag': 'v25.03.2',
      'nextTag': 'v25.03.3',
      'nextVersion': '25.03.3'
    });
  });

  test('calver: throws on invalid calver format', () => {
    expect(() => action({ versioning: 'calver', calverFormat: 'INVALID' }, () => null, march2025)).toThrowError();
  });

});
