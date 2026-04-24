"use strict"

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

    const createRtCornerCurve = ({ width, depth, ratio }) => {
        const validSize = [
            width || depth / ratio,
            depth || width * ratio,
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
     * @namespace curve
     */
    const curves = {
        rightCorner: {
            /**
             * ...
             * @memberof profiles.curve
             * @param {object} opts
             * @returns ...
             */
            golden: ({ width, depth }) => {
                return createRtCornerCurve({ width, depth, ratio: constants.PHI })
            },
            /**
             * ...
             * @memberof profiles.curve
             * @param {object} opts
             * @returns ...
             */
            sixtyThirty: ({ width, depth }) => {
                return createRtCornerCurve({ width, depth, ratio: 2 })
            },
            /**
             * ...
             * @memberof profiles.curve
             * @param {object} opts
             * @returns ...
             */
            silver: ({ width, depth }) => {
                return createRtCornerCurve({ width, depth, ratio: constants.SILVER_RATIO })
            },
            /**
             * ...
             * @memberof profiles.curve
             * @param {object} opts
             * @returns ...
             */
            bronze: ({ width, depth }) => {
                return createRtCornerCurve({ width, depth, ratio: constants.BRONZE_RATIO })
            },
            /**
             * ...
             * @memberof profiles.curve
             * @param {object} opts
             * @returns ...
             */
            copper: ({ width, depth }) => {
                return createRtCornerCurve({ width, depth, ratio: constants.COPPER_RATIO })
            },
            /**
             * ...
             * @memberof profiles.curve
             * @param {object} opts
             * @returns ...
             */
            superGolden: ({ width, depth }) => {
                return createRtCornerCurve({ width, depth, ratio: constants.SUPERGOLDEN_RATIO })
            },
            /**
             * ...
             * @memberof profiles.curve
             * @param {object} opts
             * @returns ...
             */
            plastic: ({ width, depth }) => {
                return createRtCornerCurve({ width, depth, ratio: constants.PLASTIC_RATIO })
            },
        },
    }

    return curves
}


module.exports = { init: curveBuilder }
