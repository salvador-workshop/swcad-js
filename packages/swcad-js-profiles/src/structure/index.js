"use strict"

const structureInit = ({ jscad, swcadJs }) => {
    const structure = {
        foils2d: require('./foils-2d').init({ jscad, swcadJs }),
        text2d: require('../text').init({ jscad, swcadJs }),
        arch: require('./arch-2d').init({ jscad, swcadJs }),
    }

    return structure
}

module.exports = { init: structureInit };
