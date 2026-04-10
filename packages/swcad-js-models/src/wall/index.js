"use strict"

const walls = require('./walls')
const wallEntryway = require('./wall-entryway')

const modelsInit = ({ jscad, swcadJs }) => {
    const wallBase = walls.init({ jscad, swcadJs })
    
    const preLib = {
        ...swcadJs,
        models: {
            ...swcadJs.models,
            wall: wallBase,
        }
    }

    return {
        ...wallBase,
        entryway: wallEntryway.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: modelsInit,
};
