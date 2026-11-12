"use strict"

const linesInit = ({ jscad, swcadJs }) => {
    const {
        geometry
    } = swcadJs.calcs

    /**
     * Calculates details for linear components, which are given starting + ending points and an end offset value.
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof calcs.geometry.lines
     */
    const lineComponentDetails = (opts) => {
        const {
            startPt,
            endPt,
            endOffset,
        } = opts

        const midPt = geometry.midpointBetweenPoints(startPt, endPt)
        const lineLength = geometry.distanceBetweenPoints(startPt, endPt)
        const offsetLineLength = lineLength - (endOffset * 2)
        const lineComponentAngle = geometry.angleOfTwoPtLine(startPt, endPt)

        return {
            midPt,
            lineLength,
            offsetLineLength,
            lineComponentAngle,
        }
    }

    /**
     * Calculations for linear components
     * @namespace lines
     * @memberof calcs.geometry
     */
    return {
        lineComponentDetails,
    }
}

module.exports = {
    init: linesInit
}
