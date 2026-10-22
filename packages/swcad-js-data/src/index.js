"use strict"

const constants = require('./constants')
const functions = require('./functions')
const standards = require('./standards')
const errors = require('./errors')
const internals = require('./internals')

const dataInit = ({ jscad }) => {
    /**
     * Data
     * @namespace data
     * @author R. J. Salvador (Salvador Workshop)
     */

    const data = {
        constants: constants,
        functions: functions,
        standards: standards.init({ jscad }),
        errors: errors,
        internals: internals.init({ jscad }),
    }

    return data
}

module.exports = {
    init: dataInit,
};
