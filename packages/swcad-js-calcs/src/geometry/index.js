"use strict"

const geoRegPolyModule = require('./geo-reg-poly');
const reinforcementModule = require('./reinforcement');

/**
 * Finds the central point (avg.) between the given points
 * @param {number[]} points - x and y coordinates
 * @param {string} mode - '3d' (default) or '2d'
 * @memberof calcs.geometry.points
 * @returns central point (avg.) between the given points
 */
const ptCentroid = (points, mode = '3d') => {
    const min = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
    const max = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]

    points.forEach(pt => {
        min[0] = Math.min(min[0], pt[0])
        min[1] = Math.min(min[1], pt[1])

        max[0] = Math.max(max[0], pt[0])
        max[1] = Math.max(max[1], pt[1])

        if (mode === '3d') {
            min[2] = Math.min(min[2], pt[2])
            max[2] = Math.max(max[2], pt[2])
        }
    })

    let output = [
        (max[0] + min[0]) / 2,
        (max[1] + min[1]) / 2,
    ]
    if (mode === '3d') {
        output = [...output, (max[2] + min[2]) / 2]
    }
    return output;
}

/**
 * Geometric functions
 * @memberof calcs
 * @namespace geometry
 */

const geometryInit = ({ jscad, swcadJs }) => {
    const { math } = swcadJs.calcs;
    const { constants } = swcadJs.data;

    /**
     * Returns angle of a two-point line.
     * @memberof calcs.geometry
     * @param {number[]} startPt - x and y coordinate 
     * @param {number[]} endPt - x and y coordinate 
     * @param {string} mode - 'rad' (default) or 'deg'F
     * @returns angle of a two-point line.
     */
    const angleOfTwoPtLine = (startPt, endPt, mode = 'rad') => {
        const diffY = endPt[1] - startPt[1]
        const diffX = endPt[0] - startPt[0]
        const angleRad = Math.atan2(diffY, diffX)
        const angleDeg = angleRad * (180 / Math.PI)

        return mode == 'deg' ? angleDeg : angleRad
    }

    /**
     * Gets a point from a given angle and distance, starting from [0, 0]
     * @memberof calcs.geometry
     * @param {number} angleRad - angle (radians)
     * @param {number} dist - distance
     * @returns x and y coord of calculated point
     */
    const pointFromAngleAndDist = (angleRad, dist) => {
        const x = dist * Math.cos(angleRad)
        const y = dist * Math.sin(angleRad)
        return [x, y]
    }

    /**
     * Gets line data from outline points
     * @param {*} outlinePts 
     * @returns array of line details
     * @memberof calcs.geometry
     * @private
     */

    const getLineDataFromOutlinePoints = (outlinePts) => {
        const lineData = []

        for (let ptIdx = 0; ptIdx < outlinePts.length - 1; ptIdx++) {
            const startPt = outlinePts[ptIdx];
            const endPt = outlinePts[ptIdx + 1];

            const coordDiffs = [
                endPt[0] - startPt[0],
                endPt[1] - startPt[1],
            ]
            const midPt = [
                startPt[0] + (coordDiffs[0] / 2),
                startPt[1] + (coordDiffs[1] / 2),
            ]
            const lineLength = Math.hypot(coordDiffs[0], coordDiffs[1])
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

    /**
     * Gets triangular points in area
     * @memberof calcs.geometry
     * @param {number} x - maximum X bound
     * @param {number} y - maximum Y bound
     * @param {number} distance - distance between points
     * @param {boolean} centrePoints - if true, points will be centred on origin. If false, origin will be at a corner.
     * @returns set of x and y coordinates for points
     */

    const getTriangularPtsInArea = (x, y, distance, centrePoints = true) => {
        const halfDist = distance / 2;
        const allPoints = [];

        const allYCoords = [];
        let yCoordCtr = 0;
        do {
            allYCoords.push(yCoordCtr);
            yCoordCtr = distance * constants.EQUI_TRIANGLE_HEIGHT_FACTOR + yCoordCtr;
        } while (yCoordCtr < y);

        const hasOffsetCollision = false

        let yIdxCtr = 0;
        do {
            let xCtr = 0;
            do {
                if (math.isEven(yIdxCtr)) {
                    allPoints.push({ x: xCtr, y: allYCoords[yIdxCtr] });
                } else {
                    if (halfDist + xCtr <= x) {
                        allPoints.push({ x: halfDist + xCtr, y: allYCoords[yIdxCtr] });
                    }
                }
                xCtr = xCtr + distance;
            } while (xCtr < x);
            yIdxCtr = yIdxCtr + 1;
        } while (yIdxCtr < allYCoords.length);

        if (!centrePoints) {
            return allPoints
        }

        const simplePts = allPoints.map(pt => [pt.x, pt.y])
        const pointCentroid = ptCentroid(simplePts, '2d');

        return allPoints.map(pt => {
            return {
                x: pt.x - pointCentroid[0],
                y: pt.y - pointCentroid[1],
            }
        });
    }

    /**
     * Gets square points in area
     * @memberof calcs.geometry
     * @param {number} x - maximum X bound
     * @param {number} y - maximum Y bound
     * @param {number} distance - distance between points
     * @param {boolean} centrePoints - if true, points will be centred on origin. If false, origin will be at a corner.
     * @returns set of x and y coordinates for points
     */
    const getSquarePtsInArea = (x, y, distance, centrePoints = true) => {
        const halfDist = distance / 2;
        const allXCoords = [];
        let xCtr = 0;
        do {
            allXCoords.push(xCtr);
            xCtr = xCtr + distance;
        } while (xCtr <= x);

        const allYCoords = [];
        let yCtr = 0;
        do {
            allYCoords.push(yCtr);
            yCtr = yCtr + distance;
        } while (yCtr <= y);

        const allPoints = math.arrayCartesianProduct(allXCoords, allYCoords);
        const outPts = allPoints.map(pt => { return { x: pt[0], y: pt[1] } });

        if (!centrePoints) {
            return outPts
        }

        const simplePts = outPts.map(pt => [pt.x, pt.y])
        const pointCentroid = ptCentroid(simplePts, '2d');

        return outPts.map(pt => {
            return {
                x: pt.x - pointCentroid[0],
                y: pt.y - pointCentroid[1],
            }
        });
    }

    /**
     * Functions related to sets of Cartesian points
     * @memberof calcs.geometry
     * @namespace points
     */
    const points = {
        centroid: ptCentroid,
    }

    const regPoly = geoRegPolyModule.init({ jscad, swcadJs })
    const reinforcement = reinforcementModule.init({ jscad, swcadJs })

    return {
        angleOfTwoPtLine,
        pointFromAngleAndDist,
        getLineDataFromOutlinePoints,
        getTriangularPtsInArea,
        getSquarePtsInArea,
        points,
        regPoly,
        reinforcement,
    }
}

module.exports = { init: geometryInit };
