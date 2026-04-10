"use strict"

/**
 * ...
 * @memberof profiles
 * @namespace text
 */

const textUtils = ({ jscad, swcadJs }) => {
    const { union } = jscad.booleans
    const { circle } = jscad.primitives
    const { translate } = jscad.transforms
    const { vectorText } = jscad.text
    const { hullChain } = jscad.hulls

    /**
     * Creates a simple 2D line of text
     * @memberof profiles.text
     * @instance
     * @param {*} param0 
     * @returns ...
     */
    const basicText = (opts) => {
        const lineRadius = opts.charLineWidth / 2
        const lineCorner = circle({ radius: lineRadius })

        const lineSegmentPointArrays = vectorText({ x: 0, y: 0, input: opts.message, height: opts.fontSize }) // line segments for each character
        const lineSegments = []
        lineSegmentPointArrays.forEach((segmentPoints) => { // process the line segment
            const corners = segmentPoints.map((point) => translate(point, lineCorner))
            lineSegments.push(hullChain(corners))
        })
        return union(lineSegments)
    }

    return {
        basicText,
    }
}

module.exports = { init: textUtils };
