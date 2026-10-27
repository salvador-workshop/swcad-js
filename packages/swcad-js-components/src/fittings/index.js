const roundFittingModule = require('./round-fitting')
const rectangularFittingModule = require('./rectangular-fitting')

const fittingsInit = ({ jscad, swcadJs }) => {
    const roundFitting = roundFittingModule.init({ jscad, swcadJs })
    const rectangularFitting = rectangularFittingModule.init({ jscad, swcadJs })

    return {
        roundFitting: roundFitting.roundFitting,
        inverseRoundFitting: roundFitting.inverseRoundFitting,
        doubleRoundFitting: roundFitting.doubleRoundFitting,
        rectangularFitting: rectangularFitting.rectangularFitting,
    }
}

module.exports = { init: fittingsInit };
