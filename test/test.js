var assert = require('assert');
var lib = require('../lib')

var start = 'ohai';

console.log('in:', start);
var box = lib.encrypt('ohai');
console.log('box:', box);
var msg = lib.decrypt(box.payload, box.key);
console.log('out:', msg);

assert(msg == start);
