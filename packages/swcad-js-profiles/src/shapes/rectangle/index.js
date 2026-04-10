"use strict"

const rectFrame = require('./frame-rect')

const rectangleInit = ({ jscad, swcadJs }) => {
    return {
        frame: rectFrame.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: rectangleInit,
};
