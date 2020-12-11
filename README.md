# bananalotto-client
A client for bananalotto using node

[![Build Status](https://travis-ci.org/rem42/bananalotto-client.svg?branch=master)](https://travis-ci.org/rem42/bananalotto-client)
[![Coverage Status](https://coveralls.io/repos/github/rem42/bananalotto-client/badge.svg?branch=master)](https://coveralls.io/github/rem42/bananalotto-client?branch=master)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frem42%2Fbananalotto-client.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Frem42%2Fbananalotto-client?ref=badge_shield)
[![install size](https://packagephobia.now.sh/badge?p=bananalotto-client)](https://packagephobia.now.sh/result?p=bananalotto-client)
[![Greenkeeper badge](https://badges.greenkeeper.io/rem42/bananalotto-client.svg)](https://greenkeeper.io/)

## Installation 
```sh
npm install bananalotto-client --save
```
OR
```sh
yarn add bananalotto-client
```

## Usage
### TypeScript
```typescript
import {Bananalotto} from "bananalotto-client";

Bananalotto.init('email@email.com', 'password')
.then((client: BananalottoClient) => {
    // code
});
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frem42%2Fbananalotto-client.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Frem42%2Fbananalotto-client?ref=badge_large)
