const boxCurveModule = require('./box-curve')
const reinforcedRectModule = require('./reinforced-rect')

/**
 * ...
 * @memberof profiles
 * @namespace reinforcements
 */

const reinforcementsInit = ({ jscad, swcadJs }) => {
    const boxCurve = boxCurveModule.init({ jscad, swcadJs: preLib })
    const reinforcedRect = reinforcedRectModule.init({ jscad, swcadJs })

    return {
        boxCurve,
        reinforcedRect,
    }
}

module.exports = { init: reinforcementsInit };
