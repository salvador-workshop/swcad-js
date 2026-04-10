"use strict"

const geometryInit = ({ jscad, swcadJs }) => {
    return require('./geometry').init({ jscad, swcadJs })
}

module.exports = { init: geometryInit };
