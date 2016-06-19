# ipfs-paste-spec [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

[npm-image]: https://img.shields.io/npm/v/ipfs-paste-spec.svg
[npm-url]: https://npmjs.org/package/ipfs-paste-spec
[downloads-image]: https://img.shields.io/npm/dm/ipfs-paste-spec.svg
[downloads-url]: https://npmjs.org/package/ipfs-paste-spec

spec for encrypted pastes in ipfs

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

