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
    
    /**
     * Utils
     * @namespace utils
     * @author R. J. Salvador (Salvador Workshop)
     */

    const utils = {
        colors: coloursCore,
        layout: layout.init({ jscad, swcadJs: preLib }),
        palette: palette.init({ jscad, swcadJs: preLib }),
    }

    return utils
}

module.exports = {
    init: utilsInit,
};
