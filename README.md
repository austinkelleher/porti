# porti

[![Build Status](https://travis-ci.org/austinkelleher/porti.svg)](https://travis-ci.org/austinkelleher/porti)
![NPM version](https://badge.fury.io/js/porti.svg)

Node.js utility for obtaining random TCP ports

## Installation

```bash
npm install porti --save
```

## Usage

```javascript
const porti = require('porti');

// Finding an unused port in a range of ports. If a range is not specified,
// Porti starts at port 1024 and stops when it has found an unused port.
// None of the properties in the first options argument are required.
porti.getUnusedPort({
  min: 2000,          // lower bound of random port range to select from
  max: 5000,          // upper bound of random port range to select from
}).then((port) => {
  ...
}).catch((err) => {
  ...
})
```

Synchronous API:

```js
// Finding an unused port in a range of ports. If a range is not specified,
// Porti starts at port 1024 and stops when it has found an unused port.
// None of the properties in the first options argument are required.
const port = porti.getUnusedPortSync({
  min: 2000,          // lower bound of random port range to select from
  max: 5000,          // upper bound of random port range to select from
})
```
