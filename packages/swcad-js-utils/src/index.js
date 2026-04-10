"use strict"

const colors = require('./colors')
const extras = require('./extras')
const layout = require('./layout')
const palette = require('./palette')

const utilsInit = ({ jscad, swcadJs }) => {
    return {
        colors: colors.init({ jscad, swcadJs }),
        extras,
        layout: layout.init({ jscad, swcadJs }),
        palette: palette.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: utilsInit,
};
