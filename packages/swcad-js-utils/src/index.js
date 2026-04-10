"use strict"

const colors = require('./colors')
const extras = require('./extras')
const layers = require('./layers')
const layout = require('./layout')
const palette = require('./palette')

const utilsInit = ({ jscad, swcadJs }) => {
    return {
        colors: colors.init({ jscad, swcadJs }),
        extras: extras.init({ jscad, swcadJs }),
        layers: layers.init({ jscad, swcadJs }),
        layout: layout.init({ jscad, swcadJs }),
        palette: palette.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: utilsInit,
};
