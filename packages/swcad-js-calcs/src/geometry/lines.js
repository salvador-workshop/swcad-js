"use strict"

const linesInit = ({ jscad, swcadJs }) => {
    const {
        geometry
    } = swcadJs.calcs

    /**
     * Calculates details for linear components, which are given starting + ending points and an end offset value.
     * @param {number[]} startPt - 2D co-ordinate
     * @param {number[]} endPt - 2D co-ordinate
     * @param {number} endOffset - offset between start/end point and line start/end
     * @returns {Object.<string, (number|number[])>}
     * @memberof calcs.geometry.lines
     */
    const lineComponentDetails = (
        startPt,
        endPt,
        endOffset,
    ) => {

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
