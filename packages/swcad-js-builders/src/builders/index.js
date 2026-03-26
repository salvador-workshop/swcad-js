"use strict"

/**
 * Builders
 * @namespace builders
 */

const init = ({ lib, swLib, swFamilies }) => {
    const builders = {
        // Dependent on libs and utils
        columns: require('./columns').init({ lib, swLib, swFamilies }),
        walls: require('./walls').init({ lib, swLib, swFamilies }),
        arches: require('./arches').init({ lib, swLib, swFamilies }),
    }

    builders.entryways = require('./entryways').init({ lib, swLib: { ...swLib, builders }, swFamilies });
    builders.roofs = require('./roofs').init({ lib, swLib: { ...swLib, builders }, swFamilies });
    builders.buttress = require('./buttress').init({ lib, swLib: { ...swLib, builders }, swFamilies });

    return builders;
}

module.exports = { init };
