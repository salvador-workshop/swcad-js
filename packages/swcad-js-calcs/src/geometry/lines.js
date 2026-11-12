"use strict"

const linesInit = ({ jscad, swcadJs }) => {
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
        geometry
    } = swcadJs.calcs


    //==============================================================================


    /**
     * New Model 1
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof calcs.geometry.lines
     */
    const lineComponentDetails = (opts) => {
        const {
            startPt,
            endPt,
            endOffset,
        } = opts

        const midPt = geometry.midpointBetweenPoints(startPt, endPt)
        const lineLength = geometry.distanceBetweenPoints(startPt, endPt)
        const offsetLineLength = lineLength - (endOffset * 2)
        const compLineAngle = geometry.angleOfTwoPtLine(startPt, endPt)

        return {
            midPt,
            lineLength,
            offsetLineLength,
            compLineAngle,
        }
    }

    /**
     * Modelling functions that generate new models
     * @namespace lines
     * @memberof calcs.geometry
     */
    return {
        lineComponentDetails,
    }
}

module.exports = {
    init: linesInit
}
