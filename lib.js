var child_process = require('child_process');
var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

function encrypt(message) {
    var msg = nacl.util.decodeUTF8(message);
    var key = nacl.randomBytes(nacl.secretbox.keyLength);
    var nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    var box = nacl.secretbox(msg, nonce, key);

    var payload = new Uint8Array(nonce.byteLength + box.byteLength);
    payload.set(nonce, 0);
    payload.set(box, nonce.byteLength);

    var ascii_payload = nacl.util.encodeBase64(payload);
    var ascii_key = nacl.util.encodeBase64(key);

    return {
        payload: ascii_payload,
        key: ascii_key
    }
}

function decrypt(ascii_payload, ascii_key) {
    var key = nacl.util.decodeBase64(ascii_key);
    var payload = nacl.util.decodeBase64(ascii_payload);
    var nonce = payload.slice(0, nacl.secretbox.nonceLength);
    var box = payload.slice(nacl.secretbox.nonceLength);

    var message = nacl.secretbox.open(box, nonce, key);
    message = nacl.util.encodeUTF8(message);

    return message;
}

function wrap(payload) {
    console.log(payload);
    return '00000000' + payload;
}

function unwrap(msg) {
    return msg.slice(8);
}

function add(payload) {
    return _add(['add', '-q'], wrap(payload));
}

function hash(payload) {
    return _add(['add', '-qn'], wrap(payload));
}

function _add(args, data) {
    var x = child_process.spawnSync('ipfs', args, {
        input: data
    });
    return x.stdout.toString().trim();
}

function cat(path) {
    var x = child_process.spawnSync('ipfs', ['cat', '--', path]);
    var stdout = x.stdout.toString();
    return unwrap(stdout);
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;

exports.add = add;
exports.cat = cat;
exports.hash = hash;

exports.wrap = wrap;
exports.unwrap = unwrap;
