"use strict"

const geometryModule = require('./geometry')
const mathModule = require('./math')
const positionModule = require('./position')
const transformModule = require('./transform')

const linesModule = require('./geometry/lines')

const calcsInit = ({ jscad, swcadJs }) => {
    const math = mathModule.init({ jscad, swcadJs })
    const position = positionModule.init({ jscad, swcadJs })

    const initCalcs = {
        math,
        position,
    }
    const preLib = {
        ...swcadJs,
        calcs: initCalcs
    }

    const setupGeometry = geometryModule.init({ jscad, swcadJs: preLib })
    const setupCalcs = {
        ...initCalcs,
        geometry: setupGeometry,
        transform: transformModule.init({ jscad, swcadJs: preLib }),
    }
    preLib.calcs = setupCalcs

    const finalGeometry = {
        ...setupGeometry,
        lines: linesModule.init({ jscad, swcadJs: preLib }),
    }

    /**
     * Math calculations and basic JSCAD operations.
     * @namespace calcs
     * @author R. J. Salvador (Salvador Workshop)
     */

    const calcs = {
        ...setupCalcs,
        geometry: finalGeometry,
    }

    return calcs
}

module.exports = {
    init: calcsInit,
};
