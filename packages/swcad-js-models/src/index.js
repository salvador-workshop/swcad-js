"use strict"

const arch = require('./arch')
const foil = require('./foil')
const wall = require('./wall')
const wallEntryway = require('./wall/wall-entryway')

const modelsInit = ({ jscad, swcadJs }) => {
    const archModule = arch.init({ jscad, swcadJs })
    const wallModule = wall.init({ jscad, swcadJs })

    const preLib = {
        ...swcadJs,
        models: {
            arch: archModule,
            wall: wallModule,
        }
    }

    return {
        arch: archModule,
        foil: foil.init({ jscad, swcadJs: preLib }),
        wall: {
            ...wallModule,
            entryway: wallEntryway.init({ jscad, swcadJs: preLib })
        },
    }
}

module.exports = {
    init: modelsInit,
};
