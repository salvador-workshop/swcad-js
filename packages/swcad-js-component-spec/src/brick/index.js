"use strict"

/**
 * ...
 * @memberof components
 * @namespace brick
 */

const init = ({ jscad, swcadJs }) => {
    const brick = {
        northAmerica: require('./brick-na').init({ jscad, swcadJs }),
    }

    return brick;
}

module.exports = { init };
