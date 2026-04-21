"use strict"

const archModule = require('./arch')
const foilModule = require('./foil')
const structureModule = require('./structure')

const modelsInit = ({ jscad, swcadJs }) => {
    const arch = archModule.init({ jscad, swcadJs })

    const preLib = {
        ...swcadJs,
        models: {
            arch,
        }
    }

    /**
     * Models
     * @namespace models
     * @author R. J. Salvador (Salvador Workshop)
     */

    const models = {
        arch,
        foil: foilModule.init({ jscad, swcadJs: preLib }),
        structure: structureModule.init({ jscad, swcadJs: preLib }),
    }

    return models
}

module.exports = {
    init: modelsInit,
};
