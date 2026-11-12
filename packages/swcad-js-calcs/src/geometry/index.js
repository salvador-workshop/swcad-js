"use strict"

const geoRegPolyModule = require('./geo-reg-poly');
const pointsModule = require('./points');
const reinforcementModule = require('./reinforcement');

/**
 * Calculates co-ordinate difference between two points.
 * @param {number[]} startPt - starting 2D coordinates
 * @param {number[]} endPt - ending 2D coordinates
 * @returns {number[]} 2D coordinates of diff
 * @memberof calcs.geometry
 */
const coordDiffBetweenPoints = (startPt, endPt) => {
    return [
        endPt[0] - startPt[0],
        endPt[1] - startPt[1],
    ]
}

/**
 * Calculates distance between two co-ordinate points.
 * @param {number[]} startPt - starting 2D coordinates
 * @param {number[]} endPt - ending 2D coordinates
 * @returns {number} distance between points
 * @memberof calcs.geometry
 */
const distanceBetweenPoints = (startPt, endPt) => {
    const coordDiffs = coordDiffBetweenPoints(startPt, endPt)
    const lineLength = Math.hypot(coordDiffs[0], coordDiffs[1])
    return lineLength
}

/**
 * Calculates midpoint between two co-ordinate points.
 * @param {number[]} startPt - starting 2D coordinates
 * @param {number[]} endPt - ending 2D coordinates
 * @returns {number[]} midpoint coordinates
 * @memberof calcs.geometry
 */
const midpointBetweenPoints = (startPt, endPt) => {
    const coordDiffs = coordDiffBetweenPoints(startPt, endPt)
    const midPt = [
        startPt[0] + (coordDiffs[0] / 2),
        startPt[1] + (coordDiffs[1] / 2),
    ]
    return midPt
}

/**
 * Geometric calculations in 2D/3D space.
 * @memberof calcs
 * @namespace geometry
 */

const geometryInit = ({ jscad, swcadJs }) => {

    /**
     * Returns angle of a two-point line.
     * @memberof calcs.geometry
     * @param {number[]} startPt - x and y coordinate 
     * @param {number[]} endPt - x and y coordinate 
     * @param {string} mode - 'rad' (default) or 'deg'F
     * @returns {number} angle of a two-point line.
     */
    const angleOfTwoPtLine = (startPt, endPt, mode = 'rad') => {
        const coordDiffs = coordDiffBetweenPoints(startPt, endPt)
        const angleRad = Math.atan2(coordDiffs[1], coordDiffs[0])
        const angleDeg = angleRad * (180 / Math.PI)

        return mode == 'deg' ? angleDeg : angleRad
    }

    /**
     * Gets a point from a given angle and distance, starting from [0, 0].
     * @memberof calcs.geometry
     * @param {number} angleRad - angle (radians)
     * @param {number} dist - distance
     * @returns {number[]} x and y coord of calculated point
     */
    const pointFromAngleAndDist = (angleRad, dist) => {
        const x = dist * Math.cos(angleRad)
        const y = dist * Math.sin(angleRad)
        return [x, y]
    }

    /**
     * Gets line data from outline points.
     * @param {number[][]} outlinePts 
     * @returns {Object[]} array of line details
     * @memberof calcs.geometry
     * @private
     */

    const getLineDataFromOutlinePoints = (outlinePts) => {
        const lineData = []

        for (let ptIdx = 0; ptIdx < outlinePts.length - 1; ptIdx++) {
            const startPt = outlinePts[ptIdx];
            const endPt = outlinePts[ptIdx + 1];

            const midPt = midpointBetweenPoints(startPt, endPt)
            const lineLength = distanceBetweenPoints(startPt, endPt)
            const lineAngle = angleOfTwoPtLine(startPt, endPt)

            lineData.push({
                start: startPt,
                end: endPt,
                mid: midPt,
                length: lineLength,
                angle: lineAngle,
            })
        }

        return lineData
    }

    const points = pointsModule.init({ jscad, swcadJs })
    const regPoly = geoRegPolyModule.init({ jscad, swcadJs })
    const reinforcement = reinforcementModule.init({ jscad, swcadJs })

    return {
        coordDiffBetweenPoints,
        angleOfTwoPtLine,
        midpointBetweenPoints,
        pointFromAngleAndDist,
        getLineDataFromOutlinePoints,
        distanceBetweenPoints,
        points,
        regPoly,
        reinforcement,
    }
}

module.exports = { init: geometryInit };
