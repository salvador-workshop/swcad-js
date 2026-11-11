const boxSupportModule = require('./box-support')
const reinforcedLengthModule = require('./reinforced-length')
const reinforcedJoistModule = require('./reinforced-joist')
const reinforcedRectPanelModule = require('./reinforced-rect-panel')

/**
 * Modelling functions that generate 3D reinforcements.
 * @memberof components
 * @namespace reinforcements
 */

const reinforcementsInit = ({ jscad, swcadJs }) => {
    const boxSupport = boxSupportModule.init({ jscad, swcadJs })
    const reinforcedLength = reinforcedLengthModule.init({ jscad, swcadJs })
    const reinforcedJoist = reinforcedJoistModule.init({ jscad, swcadJs })
    const reinforcedRectPanel = reinforcedRectPanelModule.init({ jscad, swcadJs })

    return {
        boxSupport,
        reinforcedLength,
        reinforcedJoist,
        reinforcedRectPanel,
    }
}

module.exports = { init: reinforcementsInit };
