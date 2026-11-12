"use strict"

const poinstInit = ({ jscad, swcadJs }) => {
    const {
        cube,
        cylinder,
        sphere,
        cylinderElliptic,
        circle,
        cuboid,
        roundedCuboid,
        roundedCylinder,
        roundedRectangle,
        rectangle,
        triangle,
    } = jscad.primitives

    const {
        align,
        translate,
        rotate,
        mirror
    } = jscad.transforms

    const {
        intersect,
        subtract,
        union,
        scission
    } = jscad.booleans

    const {
        extrudeLinear,
        extrudeRotate,
        project
    } = jscad.extrusions

    const {
        measureDimensions,
        measureBoundingBox,
        measureVolume
    } = jscad.measurements

    const {
        hull,
        hullChain
    } = jscad.hulls

    const { vectorText } = jscad.text
    const { toOutlines } = jscad.geometries.geom2
    const { TAU } = jscad.maths.constants
    const { colorize } = jscad.colors

    const {
        standards,
    } = swcadJs.data

    const {
        math,
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Finds the central point (avg.) between the given points.
     * @param {number[]} points - x and y coordinates
     * @param {string} mode - '3d' (default) or '2d'
     * @memberof calcs.geometry.points
     * @returns {number[]} central point (avg.) between the given points
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
     * Gets triangular points in area.
     * @memberof calcs.geometry.points
     * @param {number} x - maximum X bound
     * @param {number} y - maximum Y bound
     * @param {number} distance - distance between points
     * @param {boolean} centrePoints - if true, points will be centred on origin. If false, origin will be at a corner.
     * @returns {Object[]} set of x and y coordinates for points
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
     * Gets square points in area.
     * @memberof calcs.geometry.points
     * @param {number} x - maximum X bound
     * @param {number} y - maximum Y bound
     * @param {number} distance - distance between points
     * @param {boolean} centrePoints - if true, points will be centred on origin. If false, origin will be at a corner.
     * @returns {Object[]} set of x and y coordinates for points
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
     * Calculations around sets of co-ordinate points in 2D/3D space.
     * @memberof calcs.geometry
     * @namespace points
     */
    return {
        ptCentroid,
        getTriangularPtsInArea,
        getSquarePtsInArea,
    }
}

module.exports = {
    init: poinstInit
}
