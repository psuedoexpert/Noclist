# Ad Hoc Noclist Homework

Completed Noclist Ad Hoc homework assignment.

## Overview

The task is to create an application (Javascript) that securely and politely asks the **BADSEC** server for a list of users and prints it to stdout in JSON format.

## Task

Noclist Ad Hoc Assignment: [Task](./TASK.md)

## Building

Here's a link to the instructions on how to build and run: [Instructions](./COMMENTS)

## Output

Example Output:

```json
["9757263792576857988", "7789651288773276582", "16283886502782682407", "...etc"]
```

## Notes

To start with, I setup a blank Node.js project with `npm init` and opened the project in VSCode.  After starting the server with Docker, I dove into the requirements.

The requirements are straightforward and unambiguous.

I broke up the main problem into three smaller problems:

1. Getting the checksum
2. Getting the authentication token
3. Getting the users list

Geting the checksum is straightforward and required minimal overhead.  Querying the endpoints and setting the headers required some consideration about using external libraries.  In the end, I ended up writing a module to handle the requests, since they were all GET requests and only needed to have different endpoints/headers.  I also didn't want to use another dependency if I didn't have to.

For the authentication token and users list, in order to politely query the API, I chose an approach that utilizes recursion within the functions, rather than while loops.  The application queries the endpoints up to the maximum number of attempts, and uses try/catch blocks to catch errors and handle them appropriately.

For testing, I chose to use the "Jest" testing library, since it had minimal overhead, a straightforward syntax, and a good mocking framework.  I mocked the network calls to test some aspects of the functions without making additional network calls.

With more time, I would have considered creating seprate classes, reducing overhead, and writing more tests.
