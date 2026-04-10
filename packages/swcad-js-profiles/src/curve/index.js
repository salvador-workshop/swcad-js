"use strict"

/**
 * Builds various 2D profiles
 * @namespace profiles
 */

const curveBuilder = ({ jscad, swcadJs }) => {
    const { square, circle, rectangle, triangle, ellipse } = jscad.primitives
    const { intersect, union, subtract } = jscad.booleans
    const { rotate, align } = jscad.transforms
    const { bezier } = jscad.curves
    const { geom2, path2 } = jscad.geometries

    const { constants } = swcadJs.data
    const { position } = swcadJs.calcs

    const getBezierPts = (bezierCurve, segments) => {
        const points = [];
        const segmentsInput = segments - 1
        const totalLength = bezier.length(100, bezierCurve)
        const increment = totalLength / segmentsInput;
        for (let i = 0; i <= segmentsInput; i++) {
            const t = bezier.arcLengthToT({ distance: i * increment }, bezierCurve);
            const point = bezier.valueAt(t, bezierCurve);
            points.push(point);
        }
        return points;
    }

    const createRtCornerCurve = ({ length, width, ratio }) => {
        const validSize = [
            length || width * ratio,
            width || length / ratio
        ]
        const container = rectangle({ size: validSize })
        const bez = bezier.create([
            [0, 0],
            [0, validSize[1]],
            [validSize[0], validSize[1]]
        ])
        const segments = 12
        const bezPts = getBezierPts(bez, segments)
        const bezPath = path2.fromPoints({ closed: true }, [[0, validSize[1]], ...bezPts])
        const bezGeom = align({ modes: ['center', 'center', 'center'] }, geom2.fromPoints(path2.toPoints(bezPath)))
        return subtract(container, bezGeom)
    }

    /**
     * Curve profiles
     * @memberof profiles
     * @namespace curves
     */
    const curves = {
        rightCorner: {
            /**
             * ...
             * @memberof profiles.curves
             * @param {object} opts
             * @returns ...
             */
            golden: ({ length, width }) => {
                return createRtCornerCurve({ length, width, ratio: constants.PHI })
            },
            /**
             * ...
             * @memberof profiles.curves
             * @param {object} opts
             * @returns ...
             */
            sixtyThirty: ({ length, width }) => {
                return createRtCornerCurve({ length, width, ratio: 2 })
            },
            /**
             * ...
             * @memberof profiles.curves
             * @param {object} opts
             * @returns ...
             */
            silver: ({ length, width }) => {
                return createRtCornerCurve({ length, width, ratio: constants.SILVER_RATIO })
            },
            /**
             * ...
             * @memberof profiles.curves
             * @param {object} opts
             * @returns ...
             */
            bronze: ({ length, width }) => {
                return createRtCornerCurve({ length, width, ratio: constants.BRONZE_RATIO })
            },
            /**
             * ...
             * @memberof profiles.curves
             * @param {object} opts
             * @returns ...
             */
            copper: ({ length, width }) => {
                return createRtCornerCurve({ length, width, ratio: constants.COPPER_RATIO })
            },
            /**
             * ...
             * @memberof profiles.curves
             * @param {object} opts
             * @returns ...
             */
            superGolden: ({ length, width }) => {
                return createRtCornerCurve({ length, width, ratio: constants.SUPERGOLDEN_RATIO })
            },
            /**
             * ...
             * @memberof profiles.curves
             * @param {object} opts
             * @returns ...
             */
            plastic: ({ length, width }) => {
                return createRtCornerCurve({ length, width, ratio: constants.PLASTIC_RATIO })
            },
        },
    }

    return curves
}


module.exports = { init: curveBuilder }
