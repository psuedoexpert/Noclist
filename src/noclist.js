/* Noclist */
/* Securely and politely asks the BADSEC server for the */
/* list of users and prints it to stdout in JSON format. */

/* Requires */

// Config
const {
    ENDPOINT_AUTH,
    ENDPOINT_USERS,
    HEADER_AUTH_TOKEN,
    HEADER_CHECKSUM,
    ATTEMPTS_MAX
} = require('./config');

// HTTP Get Request to BADSEC
const request = require('./request');

// Crypto
const crypto = require('crypto');


/* Functions */

/**
 * Get the SHA256 Checksum of the authentication token and path
 * @param {String} authToken
 * @param {String} path
 */
function getChecksum(authToken, path) {
    return crypto.createHash('sha256').update(authToken + path).digest(`hex`);
}

/**
 * Request authentication token from the /auth endpoint
 * Retries until the max number of attempts is reached
 * @returns authenticationToken on success
 * @throws Error on failure
 */
async function requestAuthentication(failures = 0) {

    // Check if we've attempted the maximum amount of times
    if (failures >= ATTEMPTS_MAX) {
        // Failed
        return Promise.reject(new Error("Unable to get the authentication token in the maximum number of attempts."));
    }

    // Try making the /auth GET request
    try {
        const requestRes = await request(ENDPOINT_AUTH);
        if (authenticationToken = requestRes.headers[HEADER_AUTH_TOKEN]) {
            // Return the auth token
            return authenticationToken;
        }
    } catch (err) {
        // Log error to stderr
        process.stderr.write("Error getting authentication token - attempt #" + (failures + 1) + ": " + err.message + "\n");
        // Increment failures and retry
        return requestAuthentication(failures + 1);
    }

    // Log error to stderr
    process.stderr.write("Error getting authentication token - attempt #" + (failures + 1) + ": invalid or missing token from response\n");
    // Increment failures and retry
    return requestAuthentication(failures + 1);

}

/**
 * Request Users List from the /users endpoint
 * Retries until the max number of attempts is reached
 * @returns usersList on success
 * @throws Error on failure
 */
async function requestUsersList(authToken, failures = 0) {

    // Check if we've attempted the maximum amount of times
    if (failures >= ATTEMPTS_MAX) {
        // Failed
        return Promise.reject(new Error("Unable to get the list of users in the maximum number of attempts."));
    }

    // Try making the /auth GET request
    try {
        const requestRes = await request(ENDPOINT_USERS, {
            [HEADER_CHECKSUM]: getChecksum(authToken, ENDPOINT_USERS)
        });
        if (usersList = requestRes.body) {
            // Return the usersList split by newlines
            return usersList.split('\n');
        }
    } catch (err) {
        // Log error to stderr
        process.stderr.write("Error getting users list - attempt #" + (failures + 1) + ": " + err.message + "\n");
        // Increment failures and retry
        return requestUsersList(authToken, failures + 1);
    }

    // Log error to stderr
    process.stderr.write("Error getting users list - attempt #" + (failures + 1) + ": invalid or missing list from response body\n");
    // Increment failures and retry
    return requestUsersList(authToken, failures + 1);

}


/* Exports */
module.exports = {
    getChecksum,
    requestAuthentication,
    requestUsersList
};