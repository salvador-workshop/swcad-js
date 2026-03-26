"use strict"

/**
 * ...
 * @namespace families.trim
 */

const init = ({ lib, swLib }) => {
    const trim = {
        aranea: require('./trim-aranea').init({ lib, swLib }),
    }

    return trim;
}

module.exports = { init };
