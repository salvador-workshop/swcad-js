"use strict"

const buildersModule = require('./builders');

const init = ({ lib, swLib, swFamilies }) => {
    return buildersModule.init({ lib, swLib, swFamilies });;
}

module.exports = { init };
