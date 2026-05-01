"use strict"

/**
 * ...
 * @memberof components
 * @namespace text
 */

const DEFAULT_EXTRUDE_HEIGHT = 1;
const DEFAULT_PANEL_HEIGHT = 2;

const textUtils = ({ jscad, swcadJs }) => {
    const { subtract } = jscad.booleans
    const { cuboid } = jscad.primitives
    const { align } = jscad.transforms
    const { extrudeLinear } = jscad.extrusions
    const { measureDimensions } = jscad.measurements;

    const { text: text2d } = swcadJs.profiles

    /**
     * Creates a simple 3D line of text
     * @memberof components.text
     * @instance
     * @param {*} param0 
     * @returns ...
     */
    const flatText = (opts) => {
        if (opts.message === undefined || opts.message.length === 0) return []

        const message2D = text2d.basicText({
            message: opts.message,
            fontSize: opts.fontSize,
            charLineWidth: opts.charLineWidth
        })
        const message3D = extrudeLinear({ height: opts.extrudeHeight || DEFAULT_EXTRUDE_HEIGHT }, message2D)

        return align({ modes: ['center', 'center', 'center'] }, message3D)
    }

    /**
     * Creates a 3D line of text, with engraved profile
     * @memberof components.text
     * @instance
     * @param {*} opts 
     * @returns ...
     */
    const engravedText = (opts) => {
        const inverted = opts.inverted || false
        const interThickness = opts.interfaceThickness || 1.333333
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
        return union(lineSegments)
    }

    /**
     * Creates a rectangular panel with engraved text
     * @memberof components.text
     * @instance
     * @param {*} opts 
     * @returns ...
     */
    const textPanel = (opts) => {
        const extrudeHt = opts.extrudeHeight || DEFAULT_EXTRUDE_HEIGHT;

        const textModel = flatText({
            ...opts,
            extrudeHeight: extrudeHt,
        });
        const textModelDims = measureDimensions(textModel);
        const panelOffset = opts.panelOffset || 2;

        const textPanel = cuboid({
            size: [
                textModelDims[0] + panelOffset,
                textModelDims[1] + panelOffset,
                opts.panelThickness || extrudeHt * 2
            ]
        })

        const embossedPanel = subtract(
            align({ modes: ['center', 'center', 'max'] }, textPanel),
            align({ modes: ['center', 'center', 'max'] }, textModel)
        )

        return align({ modes: ['center', 'center', 'center'] }, embossedPanel);
    }

    const text = {
        flatText,
        engravedText,
        textPanel,
    }

    return text
}

module.exports = { init: textUtils };
