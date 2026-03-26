"use strict"

/**
 * ...
 * @namespace families.lumber
 */

const init = ({ lib, swLib }) => {
    const lumber = {
        northAmerica: require('./lumber-na').init({ lib, swLib }),
    }

    return lumber;
}

module.exports = { init };
