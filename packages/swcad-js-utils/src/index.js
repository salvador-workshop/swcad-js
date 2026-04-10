"use strict"

const colors = require('./colors')
const layout = require('./layout')
const palette = require('./palette')

const utilsInit = ({ jscad, swcadJs }) => {
    const coloursCore = colors.init({ jscad, swcadJs })

    const preLib = {
        ...swcadJs,
        utils: {
            colors: coloursCore
        },
    }
    return {
        colors: coloursCore,
        layout: layout.init({ jscad, swcadJs: preLib }),
        palette: palette.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: utilsInit,
};
