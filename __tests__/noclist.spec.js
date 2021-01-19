/* Requires */

// Config
const {
    ATTEMPTS_MAX
} = require('../src/config');

// Noclist
const {
    getChecksum,
    requestAuthentication,
    requestUsersList
} = require('../src/noclist');

// Request
const request = require('../src/request');
jest.mock("../src/request");

/* Tests */

// Checksum
describe("Checksum function", () => {
    test('gets the checksum of \'12345/users\' and returns \'c20acb14a3d3339b9e92daebb173e41379f9f2fad4aa6a6326a696bd90c67419\'', () => {
        expect(getChecksum("12345", "/users")).toBe("c20acb14a3d3339b9e92daebb173e41379f9f2fad4aa6a6326a696bd90c67419");
    });
    test('gets the checksum of \'12A63255-1388-AB5E-071C-FA35D27C4098/users\' and returns \'782fbde2c6619f69b4280e14c9ff09fa1a82506eb8d6f79e6843f97f0de3d43a\'', () => {
        expect(getChecksum("12A63255-1388-AB5E-071C-FA35D27C4098", "/users")).toBe("782fbde2c6619f69b4280e14c9ff09fa1a82506eb8d6f79e6843f97f0de3d43a");
    });
});

// Auth
describe("RequestAuthentication function", () => {

    // Mock the default return values
    const mockDefaultResponse = {
        body: '',
        headers: {
            'badsec-authentication-token': '12345'
        }
    };
    const mockNoValueResponse = {};
    const mockBadResponse = new Error();

    // Test the mocked request call
    test('calls requestAuthentication and returns the token: \'12345\'', async () => {
        request.mockResolvedValue(mockDefaultResponse);
        await expect(requestAuthentication()).resolves.toBe("12345");
    });

    // Test the bad mocked request call (should fail)
    test('calls requestAuthentication with mocked no return value and fails', async () => {
        // Mock rejected return value
        request.mockRejectedValue(mockNoValueResponse);
        await expect(requestAuthentication()).rejects.toThrow(new Error("Unable to get the authentication token in the maximum number of attempts."));
    });

    // Test the bad mocked request call (should fail)
    test('calls requestAuthentication with mocked bad response and fails', async () => {
        // Mock rejected return value
        request.mockRejectedValue(mockBadResponse);
        await expect(requestAuthentication()).rejects.toThrow(new Error("Unable to get the authentication token in the maximum number of attempts."));
    });

    // Test the mocked request call in a loop
    test('calls requestAuthentication in a loop with mocked resolves and expects mocked resolves >= ATTEMPTS_MAX to fail', async () => {

        // Mock the resolved value
        request.mockResolvedValue(mockDefaultResponse);

        // Make a loop to go through the attempts
        for (let i = 0; i <= ATTEMPTS_MAX; i++) {

            // Mock rejected values (starting from 1-ATTEMPTS_MAX) (last should fail)
            for (let x = 0; x < i; x++) {
                // Mock rejected return value
                request.mockRejectedValueOnce(mockBadResponse);
            }

            // Check if the test should pass
            if (i < ATTEMPTS_MAX) {
                // Test the mocked request call (should pass)
                //console.log('Mocked Rejected Values ' + i + ' times - Passed');
                expect(await requestAuthentication()).toBe("12345");
            } else {
                // Test the mocked request call (should fail)
                //console.log('Mocked Rejected Values ' + i + ' times - Failed');
                await expect(requestAuthentication()).rejects.toThrow(new Error("Unable to get the authentication token in the maximum number of attempts."));
            }
        }
    });

});

// Users
describe("RequestUsersList function", () => {

    // Mock the default return values
    const mockDefaultResponse = {
        body: '12345'
    };
    const mockNoValueResponse = {};
    const mockBadResponse = new Error();

    // Test the mocked request call
    test('calls requestUsersList and returns the list: \'[12345]\'', async () => {
        request.mockResolvedValue(mockDefaultResponse);
        await expect(requestUsersList("12345")).resolves.toStrictEqual(["12345"]);
    });

    // Test the no value mocked request call (should fail)
    test('calls requestUsersList with mocked no return value and fails', async () => {
        // Mock rejected return value
        request.mockRejectedValue(mockNoValueResponse);
        await expect(requestUsersList("12345")).rejects.toThrow(new Error("Unable to get the list of users in the maximum number of attempts."));
    });

    // Test the bad mocked request call (should fail)
    test('calls requestUsersList with mocked bad value and fails', async () => {
        // Mock rejected return value
        request.mockRejectedValue(mockBadResponse);
        await expect(requestUsersList("12345")).rejects.toThrow(new Error("Unable to get the list of users in the maximum number of attempts."));
    });

    // Test the mocked request call in a loop
    test('calls requestUsersList in a loop with mocked resolves and expects mocked resolves >= ATTEMPTS_MAX to fail', async () => {

        // Mock the resolved value
        request.mockResolvedValue(mockDefaultResponse);

        // Make a loop to go through the attempts
        for (let i = 0; i <= ATTEMPTS_MAX; i++) {

            // Mock rejected values (starting from 1-ATTEMPTS_MAX) (last should fail)
            for (let x = 0; x < i; x++) {
                // Mock rejected return value
                request.mockRejectedValueOnce(mockBadResponse);
            }

            // Check if the test should pass
            if (i < ATTEMPTS_MAX) {
                // Test the mocked request call (should pass)
                //console.log('Mocked Rejected Values ' + i + ' times - Passed');
                await expect(requestUsersList("12345")).resolves.toStrictEqual(["12345"]);
            } else {
                // Test the mocked request call (should fail)
                //console.log('Mocked Rejected Values ' + i + ' times - Failed');
                await expect(requestUsersList("12345")).rejects.toThrow(new Error("Unable to get the list of users in the maximum number of attempts."));
            }
        }
    });

});