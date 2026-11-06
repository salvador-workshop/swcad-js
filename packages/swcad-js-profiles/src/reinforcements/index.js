const boxCurveModule = require('./box-curve')
const reinforcedRectModule = require('./reinforced-rect')

/**
 * Modelling functions that generate 2D shapes for reinforcements.
 * @memberof profiles
 * @namespace reinforcements
 */

const reinforcementsInit = ({ jscad, swcadJs }) => {
    const boxCurve = boxCurveModule.init({ jscad, swcadJs })
    const reinforcedRect = reinforcedRectModule.init({ jscad, swcadJs })

    return {
        boxCurve,
        reinforcedRect,
    }
}

module.exports = { init: reinforcementsInit };
