const boxSupportModule = require('./box-support')
const reinforcedJoistModule = require('./reinforced-joist')
const reinforcedRectPanelModule = require('./reinforced-rect-panel')

/**
 * ...
 * @memberof components
 * @namespace reinforcements
 */

const reinforcementsInit = ({ jscad, swcadJs }) => {
    const boxSupport = boxSupportModule.init({ jscad, swcadJs })
    const reinforcedJoist = reinforcedJoistModule.init({ jscad, swcadJs })
    const reinforcedRectPanel = reinforcedRectPanelModule.init({ jscad, swcadJs })

    return {
        boxSupport,
        reinforcedJoist,
        reinforcedRectPanel,
    }
}

module.exports = { init: reinforcementsInit };
