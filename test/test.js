var assert = require('assert');
var lib = require('../lib')

var assertObject = function(a, b) {
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);

    assert(aKeys.length == bKeys.length);

    for(var i = 0; i < aKeys.length; i++) {
        assert(aKeys[i] == bKeys[i]);
        assert(a[aKeys[i]] == b[bKeys[i]]);
    };
};

var test = function(start, metadata) {
    console.log('\n//// Start\n');
    console.log('in:', {msg: start, meta: metadata});

    var box = lib.wrap(start, metadata);
    console.log('box:', box);

    var msg = lib.unwrap(box.payload, box.key);
    console.log('out:', msg);

    metadata = metadata || {};

    assert(msg.body == start);
    assertObject(msg.meta, metadata);
    console.log('\n//// End\n');
};

test('ohai');
test('// not gonna tell you', {
    title: 'secret',
    mime: 'application/javascript'
});
