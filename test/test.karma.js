var enpaco = require('../lib.js');

describe('enpaco', function() {
    it('should encrypt without metadata', function() {
        var paste = enpaco.wrap('ohai');

        expect('payload' in paste).toBe(true);
        expect('key' in paste).toBe(true);
    });

    it('should encrypt with metadata', function() {
        var paste = enpaco.wrap('// not gonna tell you', {
            title: 'secret',
            mime: 'application/javascript'
        });

        expect('payload' in paste).toBe(true);
        expect('key' in paste).toBe(true);
    });
});
