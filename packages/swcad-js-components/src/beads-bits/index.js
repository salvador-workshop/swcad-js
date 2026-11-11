"use strict"

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
        extrudeRotate,
    } = jscad.extrusions


    const {
        constants,
        standards,
    } = swcadJs.data

    const {
        math,
    } = swcadJs.calcs

    const {
        beadsBits,
    } = swcadJs.profiles


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.beadsBits
     * @access private
     */
    const modelDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            dims: {
                size: [
                    math.inchesToMm(2),
                    math.inchesToMm(4),
                    math.inchesToMm(1),
                ],
            },
            points: {
                centre: [0, 0, 0]
            }
        }

        /** Options used by SW models */
        const standardOpts = {
            interfaceThickness: standards.INTERFACE_THICKNESS,
            fitGap: standards.FIT_GAP,
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            ...standardOpts,
            radius1: math.inchesToMm(1 / 2),
            radius2: math.inchesToMm(3 / 4),
            offset1: 0,
            offset2: 0,
            offset3: 0,
            offset4: 0,
        }

        return {
            opts: defaultOpts,
            vals: defaultValues,
        }
    }


    //------------------------------------------------------------------------------


    /**
     * Initializes options with user input
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.radius1
     * @param {number} opts.radius2
     * @param {number} opts.offset1
     * @param {number} opts.offset2
     * @param {number} opts.offset3
     * @param {number} opts.offset4
     * @returns model properties
     * @memberof components.beadsBits
     * @access private
     */
    const modelOpts = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            radius1 = defaults.opts.radius1,
            radius2 = defaults.opts.radius2,
            offset1 = defaults.opts.offset1,
            offset2 = defaults.opts.offset2,
            offset3 = defaults.opts.offset3,
            offset4 = defaults.opts.offset4,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
        } = opts

        const stdOpts = {
            interfaceThickness,
            fitGap,
        }

        const initOpts = {
            radius1,
            radius2,
            offset1,
            offset2,
            offset3,
            offset4,
            ...stdOpts,
        }

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof components.beadsBits
     * @access private
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()

        const {
            radius1,
            radius2,
            offset1,
            offset2,
            offset3,
            offset4,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        // ...

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
        }

        /** Derived user options for the model */
        const modelOpts = {
        }

        /** Various dimensions for model */
        const modelDims = {
            radius1,
            radius2,
            offset1,
            offset2,
            offset3,
            offset4,
            interfaceThickness,
            fitGap,
        }

        /** Various key points for model */
        const modelPoints = {
            centre: defaults.vals.points.centre,
        }

        /** Components used by model */
        const modelComponents = {
        }

        /* ---------------------------------------------
        *  Model Properties
        * ----------------------------------------------
        * Properties accessible to all model functions.
        * --------------------------------------------- */

        const modelProperties = {
            constants: modelConstants,
            opts: modelOpts,
            dims: modelDims,
            points: modelPoints,
            components: modelComponents,
        }


        return modelProperties
    }


    /**
     * Generates a 3D rabbet bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.radius1
     * @param {number} opts.radius2
     * @param {number} opts.offset1
     * @param {number} opts.offset2
     * @param {number} opts.offset3
     * @param {number} opts.offset4
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.beadsBits.corner
     */
    const rabbet = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const bitProfile = beadsBits.corner.rabbet(opts)[0]
        const extrudedBit = extrudeRotate({ segments: 32 }, bitProfile)

        const mainModel = extrudedBit
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 3D chamfer bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.radius1
     * @param {number} opts.radius2
     * @param {number} opts.offset1
     * @param {number} opts.offset2
     * @param {number} opts.offset3
     * @param {number} opts.offset4
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.beadsBits.corner
     */
    const chamfer = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const bitProfile = beadsBits.corner.chamfer(opts)[0]
        const extrudedBit = extrudeRotate({ segments: 32 }, bitProfile)

        const mainModel = extrudedBit
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 3D round-over bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.radius1
     * @param {number} opts.radius2
     * @param {number} opts.offset1
     * @param {number} opts.offset2
     * @param {number} opts.offset3
     * @param {number} opts.offset4
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.beadsBits.corner
     */
    const roundOver = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const bitProfile = beadsBits.corner.roundOver(opts)[0]
        const extrudedBit = extrudeRotate({ segments: 32 }, bitProfile)

        const mainModel = extrudedBit
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 3D cove bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.radius1
     * @param {number} opts.radius2
     * @param {number} opts.offset1
     * @param {number} opts.offset2
     * @param {number} opts.offset3
     * @param {number} opts.offset4
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.beadsBits.corner
     */
    const cove = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const bitProfile = beadsBits.corner.cove(opts)[0]
        const extrudedBit = extrudeRotate({ segments: 32 }, bitProfile)

        const mainModel = extrudedBit
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Modelling functions that generate 3D geometries which emulate woodworking router bits.
     * @namespace corner
     * @memberof components.beadsBits
     */
    const corner = {
        rabbet,
        chamfer,
        roundOver,
        cove,
    }

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

        const basic30DegBeadProfile = cylinderElliptic({
            height: baseThickness,
            startRadius: [width / 2, width / 2],
            endRadius: [topWidth / 2, topWidth / 2]
        })

        return basic30DegBeadProfile
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

        const basic45DegBeadProfile = cylinderElliptic({
            height: baseThickness,
            startRadius: [width / 2, width / 2],
            endRadius: [topWidth / 2, topWidth / 2]
        })

        return basic45DegBeadProfile
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
