# ipfs-paste-spec [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![dependencies][dependency-image]][dependency-url] [![travis][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/ipfs-paste-spec.svg
[npm-url]: https://npmjs.org/package/ipfs-paste-spec
[downloads-image]: https://img.shields.io/npm/dm/ipfs-paste-spec.svg
[downloads-url]: https://npmjs.org/package/ipfs-paste-spec
[dependency-image]: https://img.shields.io/david/kpcyrd/ipfs-paste-spec.svg
[dependency-url]: https://david-dm.org/kpcyrd/ipfs-paste-spec
[travis-image]: https://img.shields.io/travis/kpcyrd/ipfs-paste-spec.svg
[travis-url]: https://travis-ci.org/kpcyrd/ipfs-paste-spec

spec for encrypted pastes in ipfs

## Abstract

Current implementations of pastebins are great to share text with people. If you need to rely on secrecy, there are multiple pastebins offering client side encryption, so the server never actually has access to it's content. Yet, pastebins usually introduce single points of failure, if a pastebin shuts down, all it's pastes are lost.

ipfs-paste-spec aims for providing a way to disassociate pastes from pastebins. The paste is encrypted using libnacl and then added to ipfs. ipfs is a peer-to-peer network that allows you to address files by it's content. To do that, it hashes the encrypted paste and allows other people to download it from whoever has the file (ipfs also verifies the data wasn't modified).

Pastebins don't have ownership over the pastes created, but insert them into the network. This means you can replace the domain inside an url and access the paste on any pastebin complying to the spec.

## Goals

- avoid centralization
- easy to scale
- easy to parse
- it's possible to paste on one terminal and receive from another terminal without using a webinterface
- optionally: configureable if ciphertext is added to the ipfs dht or just hashed and stored locally

## url spec

```
https://example.com/p/<ipfs-hash>#<decryption-key>
```

## install

```
npm install ipfs-paste-spec --save
```

## demo implementation usage

```
$ echo ohai | ./cli.js encrypt
/ipfs/QmYeVNsjcHgrWpXof3nzRKkabEeVBWcASHzrXDNm4C3vFG#TuzNfsQq98F3qZUBWiTcA1eY4vyEOpIw1pvRMYMCjSY=
$ ./cli decrypt /ipfs/QmYeVNsjcHgrWpXof3nzRKkabEeVBWcASHzrXDNm4C3vFG#TuzNfsQq98F3qZUBWiTcA1eY4vyEOpIw1pvRMYMCjSY=
ohai
$
```
