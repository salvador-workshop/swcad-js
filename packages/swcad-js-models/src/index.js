"use strict"

const archModule = require('./arch')
const foilModule = require('./foil')
const structureModule = require('./wall')

const modelsInit = ({ jscad, swcadJs }) => {
    const archModule = archModule.init({ jscad, swcadJs })

    const preLib = {
        ...swcadJs,
        models: {
            arch: archModule,
        }
    }

    return {
        arch: archModule,
        foil: foilModule.init({ jscad, swcadJs: preLib }),
        structure: structureModule.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: modelsInit,
};
