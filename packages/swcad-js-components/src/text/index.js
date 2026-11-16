"use strict"

/**
 * Modelling functions that generate 3D text.
 * @memberof components
 * @namespace text
 */

const DEFAULT_EXTRUDE_HEIGHT = 1;
const DEFAULT_PANEL_HEIGHT = 2;

const textUtils = ({ jscad, swcadJs }) => {
    const { union, subtract } = jscad.booleans
    const { cuboid, cylinderElliptic } = jscad.primitives
    const { translate } = jscad.transforms
    const { vectorText } = jscad.text
    const { hullChain } = jscad.hulls
    const { extrudeLinear } = jscad.extrusions
    const { measureDimensions } = jscad.measurements;

    const { text: text2d } = swcadJs.profiles

    const {
        standards,
    } = swcadJs.data

    const {
        position,
    } = swcadJs.calcs

    /**
     * Generates a simple 3D line of text.
     * @memberof components.text
     * @param {Object} opts - Options for the model
     * @param {string} opts.message
     * @param {number} opts.fontSize
     * @param {number} opts.charLineWidth
     * @param {number} opts.extrudeHeight
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     */
    const flatText = (opts) => {
        if (opts.message === undefined || opts.message.length === 0) return []

        const message2D = text2d.basicText({
            message: opts.message,
            fontSize: opts.fontSize,
            charLineWidth: opts.charLineWidth
        })[0]
        let message3D = extrudeLinear({ height: opts.extrudeHeight || DEFAULT_EXTRUDE_HEIGHT }, message2D)
        message3D = position.ctr(message3D)

        const mainModel = message3D
        const modelParts = {
            mainModel,
            profile: message2D,
        }

        return [mainModel, modelParts, opts]
    }

    /**
     * Generates a 3D line of text, with engraved profile.
     * @memberof components.text
     * @param {Object} opts - Options for the model
     * @param {string} opts.message
     * @param {number} opts.fontSize
     * @param {number} opts.inverted
     * @param {number} opts.interfaceThickness
     * @param {number} opts.engravingDepth
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     */
    const engravedText = (opts) => {
        const inverted = opts.inverted || false
        const interThickness = opts.interfaceThickness || standards.INTERFACE_THICKNESS
        const engrDepth = opts.engravingDepth || interThickness * 0.37

        const lineRadius = engrDepth / 2

        const lineCorner = cylinderElliptic({
            height: 0.4,
            startRadius: inverted ? [lineRadius, lineRadius] : [0, 0],
            endRadius: inverted ? [0, 0] : [lineRadius, lineRadius],
        })
        // line segments for each character
        const lineSegmentPointArrays = vectorText({ x: 0, y: 0, input: opts.message, height: opts.fontSize })
        const lineSegments = []
        // process the line segment
        lineSegmentPointArrays.forEach((segmentPoints) => {
            const corners = segmentPoints.map((point) => translate(point, lineCorner))
            lineSegments.push(hullChain(corners))
        })

        let eText = union(lineSegments)
        eText = position.ctr(eText)

        const mainModel = eText
        const modelParts = {
            mainModel,
            textLines: lineSegmentPointArrays,
        }

        return [mainModel, modelParts, opts]
    }

    /**
     * Generates a rectangular panel with engraved text.
     * @memberof components.text
     * @param {Object} opts - Options for the model
     * @param {string} opts.message
     * @param {number} opts.fontSize
     * @param {number} opts.charLineWidth
     * @param {number} opts.extrudeHeight
     * @param {number} opts.panelThickness
     * @param {number} opts.panelOffset
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     */
    const textPanel = (opts) => {
        const extrudeHt = opts.extrudeHeight || DEFAULT_EXTRUDE_HEIGHT;

        const textModel = flatText({
            ...opts,
            extrudeHeight: extrudeHt,
        })[0];
        const textModelDims = measureDimensions(textModel);
        const panelOffset = opts.panelOffset || 2;

        const textPanel = cuboid({
            size: [
                textModelDims[0] + panelOffset,
                textModelDims[1] + panelOffset,
                opts.panelThickness || extrudeHt * 2
            ]
        })

        let embossedPanel = subtract(
            position.ctrMax(textPanel),
            position.ctrMax(textModel)
        )

        embossedPanel = position.ctr(embossedPanel)

        const mainModel = embossedPanel
        const modelParts = {
            mainModel,
            panel: textPanel,
            text: textModel,
        }

        return [mainModel, modelParts, opts]
    }

    const text = {
        flatText,
        engravedText,
        textPanel,
    }

    return text
}

module.exports = { init: textUtils };
