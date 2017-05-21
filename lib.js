var child_process = require('child_process');
var Parser = require('binary-parser').Parser;
var msgpack = require('msgpack-lite');
var nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

if(!('Buffer' in window)) {
    window.Buffer = require('buffer/').Buffer;
}

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

    var len = toUint16(meta.length);
    var msg = nacl.util.decodeUTF8(message);

    var buf = new Uint8Array(len.length + meta.length + msg.length);
    buf.set(new Uint8Array(len), 0);
    buf.set(new Uint8Array(meta), len.length);
    buf.set(msg, len.length + meta.length);

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

    var payload = new Uint8Array(nonce.length + box.length);
    payload.set(nonce, 0);
    payload.set(box, nonce.length);

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
    return ipfs(['add', '-q'], payload).trim();
}

function hash(payload) {
    return ipfs(['add', '-qn'], payload).trim();
}

function cat(path) {
    return ipfs(['cat', '--', path]);
}

function ipfs(args, data) {
    var params = {};
    if(data) {
        params.input = data;
    }
    var x = child_process.spawnSync('ipfs', args, params);
    return x.stdout.toString();
}

exports.wrap = wrap;
exports.unwrap = unwrap;

exports.encrypt = encrypt;
exports.decrypt = decrypt;

exports.add = add;
exports.cat = cat;
exports.hash = hash;
