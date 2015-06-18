# porti
Node.js utility for obtaining data about tcp ports.

Currently only supported on \*NIX using [lsof](https://en.wikipedia.org/wiki/Lsof)

## Installation
```bash
npm install porti --save
```
## Usage
```javascript
var porti = require('porti');

// Finding an unused port in a range of ports. If a range is not specified,
// Porti falls back to a default range DEFAULT_MIN_PORT_RANGE - DEFAULT_MAX_PORT_RANGE.
// None of the properties in the first options argument are required.
porti.getUnusedPort({
    min: 2000,          // lower bound of random port range to select from
    max: 5000,          // upper bound of random port range to select from
    env: 'PORTI_PORT'   // environment variable to set the port equal to
}, function(err, port) {
    console.log(port);
});
```


```javascript
// getPortData returns an object of information regarding the port specified
// in the first argument
porti.getPortData(8080, function(err, data) {
    console.log(data);
});
```
