# Tests

Tests are run using [newman](https://www.npmjs.com/package/newman) - a command line tool for Postman formatted rest calls.

## Install newman

`npm install -g newman`

## Start front / back-end services

`./test-run.sh`

(ctrl-c will stop everything gracefully)

## Run tests

`newman run requests.json`

