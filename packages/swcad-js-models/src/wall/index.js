"use strict"

const walls = require('./walls')

const modelsInit = ({ jscad, swcadJs }) => {

    return {
        ...walls.init({ jscad, swcadJs }),
    }
}

module.exports = {
    init: modelsInit,
};
