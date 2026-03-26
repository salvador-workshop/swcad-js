"use strict"

/**
 * ...
 * @namespace families.dowelFittings
 */

const init = ({ lib, swLib }) => {
    const dowelFittings = {
        couplers: require('./dowel-couplers').init({ lib, swLib }),
        jigs: require('./dowel-jigs').init({ lib, swLib }),
        joists: require('./dowel-joists').init({ lib, swLib }),
    }

    return dowelFittings;
}

module.exports = { init };
