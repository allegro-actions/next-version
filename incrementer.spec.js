const incrementer = require('./incrementer');

describe('incrementer', () => {

    test('should increment 1.0.0 versions accordingly to step and prefix', () => {
        expect(incrementer.increment('1.0.0')).toBe('1.0.1');
        expect(incrementer.increment('1.0.0', { step: 'patch' })).toBe('1.0.1');
        expect(incrementer.increment('1.0.0', { step: 'minor' })).toBe('1.1.0');
        expect(incrementer.increment('1.0.0', { step: 'major' })).toBe('2.0.0');
        expect(incrementer.increment('1.0.0', { prefix: 'v' })).toBe('v1.0.1');
        expect(incrementer.increment('1.0.0', { prefix: 'web-' })).toBe('web-1.0.1');
    });

    test('should return null for undefined input', () => {
        // expect
        expect(incrementer.increment(undefined)).toBe(null);
    });

    test('should return null for null input', () => {
        // expect
        expect(incrementer.increment(null)).toBe(null);
    });

    test('should return null for empty string input', () => {
        // expect
        expect(incrementer.increment('')).toBe(null);
    });

    test('should return null for invalid tag', () => {
        // expect
        expect(incrementer.increment('tast-tag')).toBe(null);
    });

})