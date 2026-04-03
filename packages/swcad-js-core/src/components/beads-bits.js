"use strict"

/**
 * @file Beads and Bits
 * @module beadsBits
 * @author R. J. Salvador (Salvador Workshop)
 * @version 0.0.1
 */

const beadsBitsInit = ({ jscad, swcadJs }) => {
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
        constants,
        position
    } = swcadJs.utils

    /**
     * Base utils and constants for setup
     * @returns {Object<string, geom3>} - Small, Medium, and Large bead profiles
     * @memberof beadsBits
     */
    const interfaceProfileBeads = (baseThickness, smWidth, mdWidth, lgWidth) => {
        const edgeOffset = baseThickness / constants.TRI_30_FACTOR / 2
        const lgTopWidth = lgWidth - (edgeOffset * 2)
        const mdTopWidth = mdWidth - (edgeOffset * 2)
        const smTopWidth = smWidth - (edgeOffset * 2)

        const lgProfile = cylinderElliptic({
            height: baseThickness,
            startRadius: [lgWidth / 2, lgWidth / 2],
            endRadius: [lgTopWidth / 2, lgTopWidth / 2]
        })

        const mdProfile = cylinderElliptic({
            height: baseThickness,
            startRadius: [mdWidth / 2, mdWidth / 2],
            endRadius: [mdTopWidth / 2, mdTopWidth / 2]
        })

        const smProfile = cylinderElliptic({
            height: baseThickness,
            startRadius: [smWidth / 2, smWidth / 2],
            endRadius: [smTopWidth / 2, smTopWidth / 2]
        })

        return {
            lg: lgProfile,
            md: mdProfile,
            sm: smProfile,
        }
    }

    return {
        interfaceProfileBeads,
    }
}


module.exports = {
    init: beadsBitsInit
}
