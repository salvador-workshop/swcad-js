"use strict"

const constants = require('./constants')
const functions = require('./functions')
const specifications = require('./specifications')
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
        specifications: specifications,
        standards: standards.init({ jscad }),
        errors: errors,
        internals: internals.init({ jscad }),
    }

    return data
}

module.exports = {
    init: dataInit,
};
