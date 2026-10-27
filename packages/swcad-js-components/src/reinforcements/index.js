const reinforcedJoistModule = require('./reinforced-joist')
const reinforcedRectPanelModule = require('./reinforced-rect-panel')

const reinforcementsInit = ({ jscad, swcadJs }) => {
    const reinforcedJoist = reinforcedJoistModule.init({ jscad, swcadJs })
    const reinforcedRectPanel = reinforcedRectPanelModule.init({ jscad, swcadJs })

    return {
        reinforcedJoist,
        reinforcedRectPanel,
    }
}

module.exports = { init: reinforcementsInit };
