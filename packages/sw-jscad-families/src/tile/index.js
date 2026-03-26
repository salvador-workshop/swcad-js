"use strict"

/**
 * ...
 * @namespace families.tile
 */

const init = ({ lib, swLib }) => {
    const tile = {
        northAmerica: require('./tile-na').init({ lib, swLib }),
    }

    return tile;
}

module.exports = { init };
