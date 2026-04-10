"use strict"

const positionInit = ({ jscad, swcadJs }) => {
    return require('./position').init({ jscad, swcadJs })
}

module.exports = { init: positionInit };
