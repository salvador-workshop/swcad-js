"use strict"

const brick = require('./brick')
const crafts = require('./crafts')
const tile = require('./tile')

const componentSpecInit = ({ jscad, swcadJs }) => {
    return {
        brick: brick.init({ jscad, swcadJs }),
        crafts: crafts.init({ jscad, swcadJs }),
        tile: tile.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: componentSpecInit,
};
