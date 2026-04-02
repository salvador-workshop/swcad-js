"use strict"

/**
 * ...
 * @memberof profiles
 * @namespace trim
 */

const init = ({ lib, swLib }) => {
    const trim = {
        aranea: require('./trim-aranea').init({ lib, swLib }),
    }

    return trim;
}

module.exports = { init };
