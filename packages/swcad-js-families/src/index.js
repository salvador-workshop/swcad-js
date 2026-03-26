"use strict"

const brickModule = require('./brick');
const craftsModule = require('./crafts');
const dowelFittingsModule = require('./dowel-fittings');
const lumberModule = require('./lumber');
const paperModule = require('./paper');
const tileModule = require('./tile');
const trimModule = require('./trim');

const init = ({ lib, swLib }) => {
    return {
        brick: brickModule.init({ lib, swLib }),
        crafts: craftsModule.init({ lib, swLib }),
        dowelFittings: dowelFittingsModule.init({ lib, swLib }),
        lumber: lumberModule.init({ lib, swLib }),
        paper: paperModule.init({ lib, swLib }),
        tile: tileModule.init({ lib, swLib }),
        trim: trimModule.init({ lib, swLib }),
    }
}

module.exports = { init };
