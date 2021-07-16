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

});
