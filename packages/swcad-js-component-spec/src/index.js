"use strict"

const brick = require('./brick')
const crafts = require('./crafts')
const tile = require('./tile')

const componentSpecInit = ({ jscad, swcadJs }) => {

    /**
     * Spec. Components
     * @namespace componentSpec
     * @author R. J. Salvador (Salvador Workshop)
     */

    const componentSpec = {
        brick: brick.init({ jscad, swcadJs }),
        crafts: crafts.init({ jscad, swcadJs }),
        tile: tile.init({ jscad, swcadJs }),
    }

    return componentSpec
}

module.exports = {
    init: componentSpecInit,
};
