"use strict"

const structureInit = ({ jscad, swcadJs }) => {
    const structure = {
        foils: require('./foils-2d').init({ jscad, swcadJs }),
        mesh: require('../mesh-2d').init({ jscad, swcadJs }),
        arch: require('./arch-2d').init({ jscad, swcadJs }),
    }

    return structure
}

module.exports = { init: structureInit };
