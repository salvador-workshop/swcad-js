"use strict"

const geometry = require('./geometry')
const mathModule = require('./math')
const positionModule = require('./position')
const transform = require('./transform')

const calcsInit = ({ jscad, swcadJs }) => {
    const math = mathModule.init({ jscad, swcadJs })
    const position = positionModule.init({ jscad, swcadJs })
    const preLib = {
        ...swcadJs,
        calcs: {
            math,
            position,
        }
    }

    /**
     * Calculations
     * @namespace calcs
     * @author R. J. Salvador (Salvador Workshop)
     */

    const calcs = {
        math,
        position,
        geometry: geometry.init({ jscad, swcadJs: preLib }),
        transform: transform.init({ jscad, swcadJs: preLib }),
    }

    return calcs
}

module.exports = {
    init: calcsInit,
};
