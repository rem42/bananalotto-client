# bananalotto-client
A client for bananalotto using node

[![Build Status](https://travis-ci.org/rem42/bananalotto-client.svg?branch=master)](https://travis-ci.org/rem42/bananalotto-client)
[![Coverage Status](https://coveralls.io/repos/github/rem42/bananalotto-client/badge.svg?branch=master)](https://coveralls.io/github/rem42/bananalotto-client?branch=master)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frem42%2Fbananalotto-client.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Frem42%2Fbananalotto-client?ref=badge_shield)

## Installation 
```sh
npm install bananalotto-client --save
```
## Usage
### TypeScript
```typescript
import {Credentials, BananalottoClient} from "bananalotto-client";

const credential = new Credentials();
credential.email = 'email@email.com';
credential.password = 'password';

BananalottoClient.init(credential)
.then((client: BananalottoClient) => {
    // code
});
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frem42%2Fbananalotto-client.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Frem42%2Fbananalotto-client?ref=badge_large)