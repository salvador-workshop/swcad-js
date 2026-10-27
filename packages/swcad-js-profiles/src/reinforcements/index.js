const reinforcedRectModule = require('./reinforced-rect')

const reinforcementsInit = ({ jscad, swcadJs }) => {
    const reinforcedRect = reinforcedRectModule.init({ jscad, swcadJs })

    return {
        reinforcedRect,
    }
}

module.exports = { init: reinforcementsInit };
