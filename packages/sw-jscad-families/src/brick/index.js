"use strict"

/**
 * ...
 * @namespace families.brick
 */

const init = ({ lib, swLib }) => {
    const brick = {
        northAmerica: require('./brick-na').init({ lib, swLib }),
    }

    return brick;
}

module.exports = { init };
