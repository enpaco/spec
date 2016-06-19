# ipfs-paste-spec

spec for encrypted pastes in ipfs

## url spec

```
https://example.com/p/<ipfs-hash>#<decryption-key>
```

## demo implementation usage

```
$ echo ohai | ./cli.js encrypt
/ipfs/QmYeVNsjcHgrWpXof3nzRKkabEeVBWcASHzrXDNm4C3vFG#TuzNfsQq98F3qZUBWiTcA1eY4vyEOpIw1pvRMYMCjSY=
$ ./cli decrypt /ipfs/QmYeVNsjcHgrWpXof3nzRKkabEeVBWcASHzrXDNm4C3vFG#TuzNfsQq98F3qZUBWiTcA1eY4vyEOpIw1pvRMYMCjSY=
ohai
$
```

