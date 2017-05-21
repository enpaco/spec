var enpaco = require('../lib.js');

describe('enpaco', function() {
    it('should encrypt without metadata', function() {
        var paste = enpaco.wrap('ohai');

        expect('payload' in paste).toBe(true);
        expect('key' in paste).toBe(true);
    });

    it('should decrypt without metadata', function() {
        var paste = enpaco.wrap('ohai');
        var result = enpaco.unwrap(paste.payload, paste.key);

        expect(result.body).toBe('ohai');
        expect(result.meta).toEqual({});
    });

    it('should encrypt with metadata', function() {
        var paste = enpaco.wrap('// not gonna tell you', {
            title: 'secret',
            mime: 'application/javascript'
        });

        expect('payload' in paste).toBe(true);
        expect('key' in paste).toBe(true);
    });

    it('should decrypt with metadata', function() {
        var paste = enpaco.wrap('// not gonna tell you', {
            title: 'secret',
            mime: 'application/javascript'
        });
        var result = enpaco.unwrap(paste.payload, paste.key);

        expect(result.body).toBe('// not gonna tell you');
        expect(result.meta).toEqual({
            title: 'secret',
            mime: 'application/javascript'
        });
    });
});
