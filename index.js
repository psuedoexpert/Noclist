/* Index */

// Noclist functions
const {
    requestAuthentication,
    requestUsersList
} = require('./src/noclist');

// Main
(async function main() {

    try {
        // Get the authentication token
        let authenticationToken = await requestAuthentication();
        // Get the users
        let listOfUsers = await requestUsersList(authenticationToken);

        // Write to stdout
        process.stdout.write(JSON.stringify(listOfUsers));

        // Return an exit code of 0
        process.exit(0);

    } catch (err) {
        // Unsuccessful
        process.stderr.write("Exiting: " + err.message + "\n");

        // Return a non-zero exit code
        process.exit(1);
    }

})();