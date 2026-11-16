"use strict"

const constants = require('./constants')
const standards = require('./standards')

const dataInit = ({ jscad }) => {
    /**
     * Mostly math constants and common dimensions/options.
     * @namespace data
     */
    const data = {
        constants: constants,
        standards: standards.init({ jscad }),
    }

    return data
}

module.exports = {
    init: dataInit,
};
