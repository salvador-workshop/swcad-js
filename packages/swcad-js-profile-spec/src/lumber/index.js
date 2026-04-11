"use strict"

/**
 * ...
 * @memberof profileSpec
 * @namespace lumber
 */

const init = ({ jscad, swcadJs }) => {
    const lumber = {
        northAmerica: require('./lumber-na').init({ jscad, swcadJs }),
    }

    return lumber;
}

module.exports = { init };
