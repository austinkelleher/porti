var exec = require('child_process').exec;

/**
* The range of ports that can be randomly selected from the getUnusedPort
* function
*/
var DEFAULT_MIN_PORT_RANGE = 5000;
var DEFAULT_MAX_PORT_RANGE = 10000;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* UNIX command that returns data regarding a port or nothing if it's not in use
* @param port The port to check in use
*/
function lsof(port, callback) {
	exec('lsof -iTCP:' + port, callback);
}

/**
* Attempts to find a free port in a provided range of ports.
* @param options:
*   - min: lower bound of random port range to select from
*   - max: upper bound of random port range to select from
*   - env: environment variable to set
*/
exports.getUnusedPort = function(options, callback) {
	var min = options.min || DEFAULT_MIN_PORT_RANGE;
	var max = options.max || DEFAULT_MAX_PORT_RANGE;
	var port = getRandomInt(min, max);

	lsof(port, function (error, stdout, stderr) {
		if(stdout) {
			return getPort(options, callback);
		}

		if(options.env && typeof(options.env) === 'string') {
			process.env[options.env.toString()] = port;
		}

		callback(null, port);
	});
};

/**
* Returns port data from lsof as an object
* @param port The port to attempt fetch data from
*/
exports.getPortData = function(port, callback) {
	lsof(port, function (error, stdout, stderr) {
		if(error) {
			return callback(error, null);
		}

		if(!stdout) {
			return callback("Port is not in use", null);
		}

		//Split the lines by newline separators
		var bashResp = stdout.split(/\r?\n/);

		// We expect that if the port is in use, the response will return with
		// two lines.
		if(bashResp.length < 2) {
			return callback("The port data response could not be parsed: " + bashResp, null);
		}

		//The lines are split up using the size of the text, so they're evenly
		//spaced. So we first remove all of those extra spaces between words,
		//and then split on individual spaces to create the objects.
		portDataKeys = bashResp[0].replace(/\s\s+/g, ' ').split(' ');
		portDataVals = bashResp[1].replace(/\s\s+/g, ' ').split(' ');

		var portData = {};

		//The key-value pairs are generated by the two lines of the response.
		//The first line represents the key, and the second line represents
		//the value.
		for(var i = 0; i < portDataKeys.length; i++) {
			portData[portDataKeys[i].toLowerCase()] = i > portDataVals.length ? '' : portDataVals[i];
		}

		callback(null, portData);
	});
};
