"use strict"

const arch = require('./arch')
const foil = require('./foil')
const wall = require('./wall')
const buttress = require('./buttress')

const modelsInit = ({ jscad, swcadJs }) => {
    return {
        arch: arch.init({ jscad, swcadJs }),
        foil: foil.init({ jscad, swcadJs }),
        wall: wall.init({ jscad, swcadJs }),
        buttress: buttress.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: modelsInit,
};
