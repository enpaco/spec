#!/usr/bin/env node
var fs = require('fs');
var lib = require('./lib');

switch(process.argv[2] || '') {
    case 'encrypt':
        var message = fs.readFileSync('/dev/stdin').toString();

        var box = lib.wrap(message);
        var path = lib.add(box.payload);

        console.log('/ipfs/' + path + '#' + box.key);
        break;

    case 'decrypt':
        var paste = process.argv[3].split('#');
        var path = paste[0];
        var key = paste[1];

        var box = lib.cat(path);
        var msg = lib.unwrap(box, key);
        process.stdout.write(msg.body);
        break;

    case 'encrypt-raw':
        var message = fs.readFileSync('/dev/stdin').toString();
        var box = lib.wrap(message);
        process.stderr.write(box.key);
        process.stdout.write(box.payload);
        break;

    case 'decrypt-raw':
        var key = process.argv[3];
        var box = fs.readFileSync('/dev/stdin').toString();

        var msg = lib.unwrap(box, key);
        process.stdout.write(msg.body);
        break;

    default:
        console.log('Usage: ./cli.js <encrypt|decrypt <key>>');
        break;
}

