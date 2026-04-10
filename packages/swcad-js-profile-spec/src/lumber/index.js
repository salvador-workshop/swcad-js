"use strict"

/**
 * ...
 * @memberof profiles
 * @namespace lumber
 */

const init = ({ jscad, swcadJs }) => {
    const lumber = {
        northAmerica: require('./lumber-na').init({ jscad, swcadJs }),
    }

    return lumber;
}

module.exports = { init };
