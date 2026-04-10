"use strict"

const geometry = require('./geometry')
const math = require('./math')
const position = require('./position')
const transform = require('./transform')

const calcsInit = ({ jscad, swcadJs }) => {
    const mathModule = math.init({ jscad, swcadJs })
    const preLib = {
        ...swcadJs,
        calcs: {
            math: mathModule,
        }
    }
    return {
        geometry: geometry.init({ jscad, swcadJs: preLib }),
        math: mathModule,
        position: position.init({ jscad, swcadJs: preLib }),
        transform: transform.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: calcsInit,
};
