const roundFittingModule = require('./round-fitting')
const rectangularFittingModule = require('./rectangular-fitting')

const fittingsInit = ({ jscad, swcadJs }) => {
    const roundFitting = roundFittingModule.init({ jscad, swcadJs })
    const rectangularFitting = rectangularFittingModule.init({ jscad, swcadJs })

    return {
        simpleRoundFitting: roundFitting.simpleRoundFitting,
        roundFitting: roundFitting.roundFitting,
        rectangularFitting: rectangularFitting.rectangularFitting,
    }
}

module.exports = { init: fittingsInit };
