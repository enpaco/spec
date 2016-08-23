var child_process = require('child_process');
var Parser = require('binary-parser').Parser;
var msgpack = require('msgpack-lite');
var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

function toUint16(num) {
    var buf = new Buffer(2);
    buf[0] = ((num>>8) & 0xff);
    buf[1] = (num & 0xff);
    return buf;
}

function wrap(message, meta) {
    if(meta) {
        meta = msgpack.encode(meta);
    } else {
        meta = new Buffer(0);
    }

    var len = toUint16(meta.byteLength);
    var msg = nacl.util.decodeUTF8(message);

    var buf = new Uint8Array(len.byteLength + meta.byteLength + msg.byteLength);
    buf.set(new Uint8Array(len), 0);
    buf.set(new Uint8Array(meta), len.byteLength);
    buf.set(msg, len.byteLength + meta.byteLength);

    return encrypt(buf);
}

function unwrap(ciphertext, key) {
    var meta = {};
    var body = '';

    switch(ciphertext.slice(0, 2)) {
        case '01':
            var decrypted = decrypt(ciphertext.slice(2), key);

            var header = new Parser()
                .uint16('len')
                .buffer('meta', {
                    length: 'len'
                });
            var packed = header.parse(new Buffer(decrypted));
            if(packed.len) {
                meta = msgpack.decode(packed.meta);
            }

            var buf = decrypted.slice(2 + packed.len);
            body = nacl.util.encodeUTF8(buf);
            break;
        default:
            return;
    }

    return {
        meta: meta,
        body: body
    }
}

function encrypt(buf) {
    var key = nacl.randomBytes(nacl.secretbox.keyLength);
    var nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    var box = nacl.secretbox(buf, nonce, key);

    var payload = new Uint8Array(nonce.byteLength + box.byteLength);
    payload.set(nonce, 0);
    payload.set(box, nonce.byteLength);

    var ascii_payload = nacl.util.encodeBase64(payload);
    var ascii_key = nacl.util.encodeBase64(key);

    return {
        payload: '01' + ascii_payload,
        key: ascii_key
    }
}

function decrypt(ascii_payload, ascii_key) {
    var key = nacl.util.decodeBase64(ascii_key);
    var payload = nacl.util.decodeBase64(ascii_payload);
    var nonce = payload.slice(0, nacl.secretbox.nonceLength);
    var box = payload.slice(nacl.secretbox.nonceLength);

    var buf = nacl.secretbox.open(box, nonce, key);

    return buf;
}

function add(payload) {
    return _add(['add', '-q'], payload);
}

function hash(payload) {
    return _add(['add', '-qn'], payload);
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
    return stdout;
}

exports.wrap = wrap;
exports.unwrap = unwrap;

exports.encrypt = encrypt;
exports.decrypt = decrypt;

exports.add = add;
exports.cat = cat;
exports.hash = hash;
