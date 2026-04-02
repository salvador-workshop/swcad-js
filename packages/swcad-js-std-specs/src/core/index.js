"use strict"

const init = ({ lib }) => {
    const core = {
        constants: require('./constants'),
        errors: require('./errors'),
    }

    core.maths = require('./maths').init({ lib, swLib: { core } });
    core.standards = require('./standards').init({ lib, swLib: { core: { ...core } } });
    core.internals = require('./internals').init({ lib, swLib: { core: { ...core } } });
    core.specifications = require('./specifications');

    return core;
}

module.exports = { init };
