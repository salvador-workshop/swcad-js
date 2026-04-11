"use strict"

/**
 * ...
 * @memberof profiles
 * @namespace trim
 */

const init = ({ jscad, swcadJs }) => {
    const trim = {
        aranea: require('./trim-aranea').init({ jscad, swcadJs }),
    }

    return trim;
}

module.exports = { init };
