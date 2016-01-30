# Build

To build, execute:

    $ npm install

# Test

To run the tests, execute:

    $ npm test

# Usage

To run the evaluator server, execute:

    $ node evaluator [PORT] [LOG_FILE]

PORT is the port the server should listen on. It defaults to 4321.

LOG_FILE is the file where logs should be written to. It defaults to
stdout.

To run the expression generator, execute:

    $ node generator EVALUATOR_URL [INTERVAL] [LOG_FILE]

EVALUATOR_URL is the URL of the evaluator server. The path component
should not be specified.

INTERVAL is the interval, in milliseconds, to wait between generated
expressions. It must be a positive integer. It defaults to 100ms.

LOG_FILE is the file where logs should be written to. It defaults to
stdout.

# Example Usage

In one terminal, run the evaluator on the default port, logging to
stdout:

    $ node evaluator

In another terminal, start one generator, generating one expression
every 500ms, logging to stdout:

    $ node generator http://localhost:4321 500

In another terminal, start a second generator, generating one expression
every 200ms, logging to stdout:

    $ node generator http://localhost:4321 200
