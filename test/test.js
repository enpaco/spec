var assert = require('assert');
var lib = require('../lib')

var start = 'ohai';

console.log('in:', start);
var box = lib.encrypt('ohai');
console.log('box:', box);
var file = lib.wrap(box.payload);
console.log('file:', file);
box.payload = lib.unwrap(file);
var msg = lib.decrypt(box.payload, box.key);
console.log('out:', msg);

assert(msg == start);
