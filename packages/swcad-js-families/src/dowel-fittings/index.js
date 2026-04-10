"use strict"

/**
 * ...
 * @memberof components
 * @namespace dowelFittings
 */

const init = ({ lib, swLib }) => {
    const dowelFittings = {
        couplers: require('./dowel-couplers').init({ lib, swLib }),
    }

    return dowelFittings;
}

module.exports = { init };
