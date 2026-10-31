const roundFittingModule = require('./round-fitting')
const rectangularFittingModule = require('./rectangular-fitting')

/**
 * ...
 * @memberof components
 * @namespace fittings
 */

const fittingsInit = ({ jscad, swcadJs }) => {
    const roundFitting = roundFittingModule.init({ jscad, swcadJs })
    const rectangularFitting = rectangularFittingModule.init({ jscad, swcadJs })

    return {
        roundFitting: roundFitting.roundFitting,
        inverseRoundFitting: roundFitting.inverseRoundFitting,
        doubleRoundFitting: roundFitting.doubleRoundFitting,
        roundFittingCutProfile: roundFitting.roundFittingCutProfile,
        invRoundFittingCutProfile: roundFitting.invRoundFittingCutProfile,
        rectangularFitting: rectangularFitting.rectangularFitting,
        rectFittingCutProfile: rectangularFitting.rectFittingCutProfile,
    }
}

module.exports = { init: fittingsInit };
