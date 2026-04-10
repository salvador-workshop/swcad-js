"use strict"

/**
 * ...
 * @memberof components
 * @namespace tile
 */

const init = ({ jscad, swcadJs }) => {
    const tile = {
        northAmerica: require('./tile-na').init({ jscad, swcadJs }),
    }

    return tile;
}

module.exports = { init };
