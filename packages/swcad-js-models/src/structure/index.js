"use strict"

const wallModule = require('./wall')
const wallEntrywayModule = require('./wall-entryway')

const structureInit = ({ jscad, swcadJs }) => {
    const wall = wallModule.init({ jscad, swcadJs })

    const preLib = {
        ...swcadJs
    }
    preLib.models.structure = {
        wall
    }

    /**
     * Builds walls and other structures
     * @namespace structure
     * @memberof models
     */

    const structure = {
        wall: wallModule.init({ jscad, swcadJs }),
        wallEntryway: wallEntrywayModule.init({ jscad, swcadJs }),
    }

    return structure
}

module.exports = {
    init: structureInit,
};
