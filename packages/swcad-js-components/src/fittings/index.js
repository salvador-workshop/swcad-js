const roundFittingModule = require('./round-fitting')
const rectangularFittingModule = require('./rectangular-fitting')

/**
 * Modelling functions that generate 3D fittings that integrate with round/rectangular profiles (dowels, dimensional lumber, etc).
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
        roundFittingCross: roundFitting.roundFittingCross,
        roundFittingTee: roundFitting.roundFittingTee,
        roundFittingSplit: roundFitting.roundFittingSplit,
        rectangularFitting: rectangularFitting.rectangularFitting,
        rectFittingCutProfile: rectangularFitting.rectFittingCutProfile,
    }
}

module.exports = { init: fittingsInit };
