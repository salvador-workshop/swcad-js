"use strict"

const geometry = require('./geometry')
const math = require('./math')
const position = require('./position')
const transform = require('./transform')

const calcsInit = ({ jscad, swcadJs }) => {
    return {
        geometry: geometry.init({ jscad, swcadJs }),
        math: math.init({ jscad, swcadJs }),
        position: position.init({ jscad, swcadJs }),
        transform: transform.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: calcsInit,
};
