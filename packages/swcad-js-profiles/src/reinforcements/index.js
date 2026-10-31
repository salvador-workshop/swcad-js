const reinforcedRectModule = require('./reinforced-rect')

/**
 * ...
 * @memberof profiles
 * @namespace reinforcements
 */

const reinforcementsInit = ({ jscad, swcadJs }) => {
    const reinforcedRect = reinforcedRectModule.init({ jscad, swcadJs })

    return {
        reinforcedRect,
    }
}

module.exports = { init: reinforcementsInit };
