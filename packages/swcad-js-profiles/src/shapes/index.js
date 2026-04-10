"use strict"

const rectangle = require('./rectangle')

const shapesInit = ({ jscad, swcadJs }) => {
    return {
        rectangle: rectangle.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: shapesInit,
};
