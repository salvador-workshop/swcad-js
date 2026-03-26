"use strict"

/**
 * ...
 * @namespace core.errors
 */

// found declaration style on SO:
// https://stackoverflow.com/a/5251506
function SwError(message) {
    this.name = 'SwError';
    this.message = message;
    this.stack = (new Error()).stack;
}

function SwInvalidInput(message) {
    this.name = 'SwInvalidInput';
    this.message = message;
    this.stack = (new Error()).stack;
}

SwInvalidInput.prototype = new Error;

const errors = {
    SwError,
    SwInvalidInput,
}

module.exports = errors;
