"use strict"

const coreModule = require('./core');

const init = ({ lib }) => {
    return coreModule.init({ lib });
}

module.exports = { init };
