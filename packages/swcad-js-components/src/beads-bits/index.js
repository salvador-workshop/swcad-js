"use strict"

const cornerBitsModule = require('./corner')

/**
 * Modelling functions that generate 3D beads (basic shapes mainly for additive `hull` functions) and bits (basic shapes for subtractive `hull` functions).
 * @namespace beadsBits
 * @memberof components 
 * @author R. J. Salvador (Salvador Workshop)
 */

const beadsBitsInit = ({ jscad, swcadJs }) => {
    const {
        cylinderElliptic,
    } = jscad.primitives

    const {
        constants,
    } = swcadJs.data

    const corner = cornerBitsModule.init({ jscad, swcadJs })

    /**
     * Generates an elliptical cylinder bead, with a 30-degree slope.
     * @param {number} baseThickness - Thickness of the bead profile
     * @param {number} width - Width of the bead profile
     * @returns {geom3} - bead profile
     * @memberof components.beadsBits
     */
    const basic30DegBead = (baseThickness, width) => {
        const edgeOffset = baseThickness / constants.TRI_30_FACTOR / 2
        const topWidth = width - (edgeOffset * 2)

        const basic30DegBeadModel = cylinderElliptic({
            height: baseThickness,
            startRadius: [width / 2, width / 2],
            endRadius: [topWidth / 2, topWidth / 2]
        })

        return basic30DegBeadModel
    }

    /**
     * Generates an elliptical cylinder bead, with a 45-degree slope.
     * @param {number} baseThickness - Thickness of the bead profile
     * @param {number} width - Width of the bead profile
     * @returns {geom3} - bead profile
     * @memberof components.beadsBits
     */
    const basic45DegBead = (baseThickness, width) => {
        const edgeOffset = baseThickness / constants.TRI_45_FACTOR / 2
        const topWidth = width - (edgeOffset * 2)

        const basic45DegBeadModel = cylinderElliptic({
            height: baseThickness,
            startRadius: [width / 2, width / 2],
            endRadius: [topWidth / 2, topWidth / 2]
        })

        return basic45DegBeadModel
    }

    /**
     * Generates a set of elliptical cylinder beads for interface connections.
     * @param {number} baseThickness - Thickness of the bead profile
     * @param {number} smWidth - Width of the small bead profile
     * @param {number} mdWidth - Width of the medium bead profile
     * @param {number} lgWidth - Width of the large bead profile
     * @returns {Object<string, geom3>} - Small, Medium, and Large bead profiles
     * @memberof components.beadsBits
     */
    const interface30DegProfileBeads = (baseThickness, smWidth, mdWidth, lgWidth) => {
        return {
            lg: basic30DegBead(baseThickness, lgWidth),
            md: basic30DegBead(baseThickness, mdWidth),
            sm: basic30DegBead(baseThickness, smWidth),
        }
    }

    return {
        interface30DegProfileBeads,
        corner,
    }
}


module.exports = {
    init: beadsBitsInit
}
