"use strict"

/**
 * Functions leveraging JSCAD to transform 2D/3D geometries.
 * @memberof calcs
 * @namespace transform
 */

const transformUtils = ({ jscad, swcadJs }) => {
    const { subtract, union } = jscad.booleans
    const { measureDimensions } = jscad.measurements;
    const { cuboid, rectangle } = jscad.primitives
    const { align, mirror, rotate } = jscad.transforms
    const { colorize } = jscad.colors

    const {
        position,
    } = swcadJs.calcs

    /**
     * Cuts one quadrant of the given 2D shape.
     * @memberof calcs.transform
     * @param {object} inShape - geom2 object
     * @returns 2D geometry of one quadrant from the given shape
     */
    const cutQuadrant = (inShape) => {
        const inShapeDims = measureDimensions(inShape)
        const maskDims = [
            inShapeDims[0] + 5,
            inShapeDims[1] + 5,
        ]
        const cornerCutDims = [
            maskDims[0] / 2,
            maskDims[1] / 2,
        ]
        const cornerCutCtr = [cornerCutDims[0] / 2, cornerCutDims[1] / 2, 0]

        const mask = subtract(
            rectangle({
                size: maskDims
            }),
            rectangle({
                size: cornerCutDims,
                center: cornerCutCtr,
            }),
        )

        return subtract(
            position.ctr(inShape),
            mask,
        )
    }

    /**
     * Clones one quadrant of the given 2D shape into all quadrants.
     * @memberof calcs.transform
     * @param {object} inShape - geom2 object
     * @returns 2D geometry with cloned quadrants
     */
    const cloneQuadrant = (inShape) => {
        const firstMirror = mirror({ normal: [0, 1, 0] }, inShape)
        const firstHalf = union(
            inShape,
            firstMirror,
        )
        const otherHalf = mirror({ normal: [1, 0, 0] }, firstHalf)

        return union(
            firstHalf,
            otherHalf,
        )
    }

    return {
        cutQuadrant,
        cloneQuadrant,
    }
}

module.exports = { init: transformUtils };
