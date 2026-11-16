"use strict"

/**
 * Modelling functions that generate 2D text.
 * @memberof profiles
 * @namespace text
 */

const textUtils = ({ jscad, swcadJs }) => {
    const { union } = jscad.booleans
    const { circle } = jscad.primitives
    const { translate } = jscad.transforms
    const { vectorText } = jscad.text
    const { hullChain } = jscad.hulls

    const {
        position,
    } = swcadJs.calcs

    /**
     * Generates a simple 2D line of text.
     * @memberof profiles.text
     * @param {Object} opts - Options for the model
     * @param {number} opts.charLineWidth - line width for letter strokes
     * @param {string} opts.message - text to be rendered
     * @param {number} opts.fontSize - font size (character height)
     * @returns {Array.<(geom2|Object.<string, geom2>|Object.<string, any>)>} Array with model, parts, and properties
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

        let bText = union(lineSegments)
        bText = position.ctr(bText)

        const mainModel = bText

        const modelParts = {
            mainModel,
            textLines: lineSegmentPointArrays,
        }

        return [mainModel, modelParts, opts]
    }

    return {
        basicText,
    }
}

module.exports = { init: textUtils };
