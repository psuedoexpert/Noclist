/* Request */
/* Exports an async function to perform a GET Request */
/* To the endpoint at the specified path with headers */

/* Imports */

// Config
const {
    URL,
    PORT
} = require('./config');

// HTTP
const http = require('http');
const agent = new http.Agent();

/* Exports */

/**
 * GET Request to the endpoint with path and headers
 * Uses the server url, port, and default agent
 * @param {HTTP Path} path
 * @param {HTTP Headers} headers
 * @returns Promise
 */
module.exports = async function request(path, headers) {

    // Return a promise
    return new Promise((resolve, reject) => {

        // Make the GET request
        http.get({
            host: URL,
            port: PORT,
            agent: agent,
            path: path,
            headers: headers
        }, (res) => {

            // Get the data
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            // Request ended (parse response)
            res.on(`end`, () => {
                const statusCode = parseInt(res.statusCode);

                // Check if the status code is 200
                if (statusCode === 200) {
                    // Success (200)
                    resolve({
                        body: data,
                        headers: res.headers,
                    });
                } else {
                    // Treat a dropped connection or any response code other than 200 as a failure.
                    reject(new Error("Server returned status code: " + statusCode));
                }
            });

        }).on(`error`, (err) => {
            // Failed for some reason
            reject(err.message);
        });
    });

};