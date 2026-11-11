const boxSupportModule = require('./box-support')
const reinforcedJoistModule = require('./reinforced-joist')
const reinforcedRectPanelModule = require('./reinforced-rect-panel')
const reinforcedRingModule = require('./reinforced-ring')

/**
 * Modelling functions that generate 3D reinforcements.
 * @memberof components
 * @namespace reinforcements
 */

const reinforcementsInit = ({ jscad, swcadJs }) => {
    const boxSupport = boxSupportModule.init({ jscad, swcadJs })
    const reinforcedJoist = reinforcedJoistModule.init({ jscad, swcadJs })
    const reinforcedRectPanel = reinforcedRectPanelModule.init({ jscad, swcadJs })
    const reinforcedRing = reinforcedRingModule.init({ jscad, swcadJs })

    return {
        boxSupport,
        reinforcedJoist,
        reinforcedRectPanel,
        reinforcedRing,
    }
}

module.exports = { init: reinforcementsInit };
