"use strict"

const constants = require('./constants')
const functions = require('./functions')
const specifications = require('./specifications')
const standards = require('./standards')
const errors = require('./errors')
const internals = require('./internals')

const dataInit = ({ jscad }) => {
    return {
        constants: constants,
        functions: functions,
        specifications: specifications,
        standards: standards.init({ jscad }),
        errors: errors,
        internals: internals.init({ jscad }),
    }
}

module.exports = {
    init: dataInit,
};
