const parser = require('./tag-parser');

describe('tag-parser', () => {

    test('should parse simple tag', () => {
        // given
        const input = '1.0.0';

        // when
        const { prefix, version } = parser.parse(input);

        // expect
        expect(prefix).toBe('');
        expect(version).toBe('1.0.0');
    });

    test('should parse semver tag', () => {
        // given
        const input = 'v1.0.0';

        // when
        const { prefix, version } = parser.parse(input);

        // expect
        expect(prefix).toBe('v');
        expect(version).toBe('1.0.0');
    });

    test('should parse custom tag', () => {
        // given
        const input = 'opbox-1.0.0';

        // when
        const { prefix, version } = parser.parse(input);

        // expect
        expect(prefix).toBe('opbox-');
        expect(version).toBe('1.0.0');
    });

    test('should parse tag with suffix', () => {
        // given
        const input = 'v1.0.0-beta.1';

        // when
        const { prefix, version, suffix } = parser.parse(input);

        // expect
        expect(prefix).toBe('v');
        expect(version).toBe('1.0.0-beta.1');
    });

    test('should parse tag with suffix and prefix', () => {
        // given
        const input = 'opbox-1.0.0-beta.1';

        // when
        const { prefix, version } = parser.parse(input);

        // expect
        expect(prefix).toBe('opbox-');
        expect(version).toBe('1.0.0-beta.1');
    });

    test('should parse tag with suffix and not semver prefix', () => {
        // given
        const input = 'opbox-1.0.0-SNAPSHOT';

        // when
        const { prefix, version } = parser.parse(input);

        // expect
        expect(prefix).toBe('opbox-');
        expect(version).toBe('1.0.0-SNAPSHOT');
    });

    test('should parse semver with suffix', () => {
        // given
        const input = 'v1.0.0-beta.1';

        // when
        const { prefix, version, suffix } = parser.parse(input);

        // expect
        expect(prefix).toBe('v');
        expect(version).toBe('1.0.0-beta.1');
    });

    test('should not parse empty string tag', () => {
        // given
        const input = '';

        // expect
        expect(parser.parse(input)).toStrictEqual({ prefix: '', version: null });
    });

    test('should not parse custom tag looking like semver', () => {
        // given
        const input = 'v1';

        // expect
        expect(parser.parse(input)).toStrictEqual({ prefix: '', version: null });
    });

    test('should not parse broken version tag', () => {
        // given
        const input = 'v-1.0.0.0.0';

        // expect
        expect(parser.parse(input)).toStrictEqual({ prefix: '', version: null });
    });

    test('should not parse tag that does not look like version tag', () => {
        // given
        const input = 'plainTag';

        // expect
        expect(parser.parse(input)).toStrictEqual({ prefix: '', version: null });
    });

});
