"use strict"

/**
 * Modelling functions that generate 2D beads (basic shapes mainly for additive `hull` functions) and bits (basic shapes for subtractive `hull` functions).
 * @namespace beadsBits
 * @memberof profiles 
 * @author R. J. Salvador (Salvador Workshop)
 */

const beadsBitsInit = ({ jscad, swcadJs }) => {
    const {
        rectangle,
        polygon,
        ellipse,
    } = jscad.primitives

    const {
        align,
        translate,
    } = jscad.transforms

    const {
        subtract,
        union,
    } = jscad.booleans

    const {
        math,
        transform,
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof profiles.beadsBits
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

        /** Computed values for option defaults */
        const defaultOpts = {
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
     * @param {*} opts 
     * @returns model properties
     * @memberof profiles.beadsBits
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
        } = opts

        const stdOpts = {
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
     * @memberof profiles.beadsBits
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


    //------------------------------------------------------------------------------


    /**
     * Generates a 2D rabbet bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.radius1 
     * @param {number} opts.radius2 
     * @param {number} opts.offset1 
     * @param {number} opts.offset2 
     * @param {number} opts.offset3 
     * @param {number} opts.offset4 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.beadsBits.corner
     */
    const rabbet = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            radius1,
            radius2,
            offset1,
            offset2,
            offset3,
            offset4,
        } = modelProperties.dims

        const baseRect = rectangle({
            size: [radius1 * 2, radius2 * 2]
        })
        const baseShape = transform.cutQuadrant(baseRect)
        let offsetRectX = null
        let offsetRectY = null
        let offsetShape = baseShape

        const hasOffsetRectX = offset1 && offset2

        if (hasOffsetRectX) {
            offsetRectX = rectangle({
                size: [radius1 + offset1, offset2]
            })

            offsetRectX = align(
                { modes: ['min', 'max', 'center'] },
                offsetRectX,
            )

            offsetShape = union(
                offsetShape,
                offsetRectX,
            )
        }

        if (offset3 && offset4) {
            const extraOffset = hasOffsetRectX ? offset2 : 0
            const nudgeDist = hasOffsetRectX ? -offset4 : 0

            offsetRectY = rectangle({
                size: [offset3, radius2 + offset4 + extraOffset]
            })

            offsetRectY = align(
                { modes: ['max', 'min', 'center'] },
                offsetRectY,
            )

            offsetRectY = translate([0, nudgeDist, 0], offsetRectY)

            offsetShape = union(
                offsetShape,
                offsetRectY,
            )
        }

        const cornerBit = align(
            { modes: ['min', 'min', 'center'] },
            offsetShape,
        )

        const fullBit = transform.cloneQuadrant(cornerBit)

        const mainModel = fullBit
        const modelParts = {
            mainModel,
            fullBit,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 2D chamfer bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.radius1 
     * @param {number} opts.radius2 
     * @param {number} opts.offset1 
     * @param {number} opts.offset2 
     * @param {number} opts.offset3 
     * @param {number} opts.offset4 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.beadsBits.corner
     */
    const chamfer = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            radius1,
            radius2,
            offset1,
            offset2,
            offset3,
            offset4,
        } = modelProperties.dims

        const diamondPts = [
            [0, -radius2],
            [radius1, 0],
            [0, radius2],
            [-radius1, 0],
        ]
        const baseDiamond = polygon({ points: diamondPts })
        const baseShape = transform.cutQuadrant(baseDiamond)
        let offsetRectX = null
        let offsetRectY = null
        let offsetShape = baseShape

        if (offset1) {
            offsetRectX = rectangle({
                size: [radius1, offset1]
            })
            offsetRectX = align(
                { modes: ['min', 'max', 'center'] },
                offsetRectX,
            )

            offsetShape = union(
                offsetShape,
                offsetRectX,
            )
        }

        if (offset2) {
            offsetRectY = rectangle({
                size: [offset2, radius2 + offset1],
            })
            offsetRectY = align(
                { modes: ['max', 'min', 'center'] },
                offsetRectY,
            )
            offsetRectY = translate([0, -offset1, 0], offsetRectY)

            offsetShape = union(
                offsetShape,
                offsetRectY,
            )
        }

        const cornerBit = align(
            { modes: ['min', 'min', 'center'] },
            offsetShape,
        )

        const fullBit = transform.cloneQuadrant(cornerBit)

        const mainModel = fullBit
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 2D round-Over bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.radius1 
     * @param {number} opts.radius2 
     * @param {number} opts.offset1 
     * @param {number} opts.offset2 
     * @param {number} opts.offset3 
     * @param {number} opts.offset4 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.beadsBits.corner
     */
    const roundOver = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            radius1,
            radius2,
            offset1,
            offset2,
            offset3,
            offset4,
        } = modelProperties.dims

        const baseRect = rectangle({
            size: [radius1, radius2],
            center: [radius1 / -2, radius2 / -2],
        })
        const baseEllipse = ellipse({ radius: [radius1, radius2] })
        const baseShape = align(
            { modes: ['min', 'min', 'center'] },
            subtract(baseRect, baseEllipse),
        )
        let offsetRectX = null
        let offsetRectY = null
        let offsetShape = baseShape

        if (offset1) {
            offsetRectX = rectangle({
                size: [radius1, offset1]
            })
            offsetRectX = align(
                { modes: ['min', 'max', 'center'] },
                offsetRectX,
            )

            offsetShape = union(
                offsetShape,
                offsetRectX,
            )
        }

        if (offset2) {
            offsetRectY = rectangle({
                size: [offset2, radius2 + offset1],
            })
            offsetRectY = align(
                { modes: ['max', 'min', 'center'] },
                offsetRectY,
            )
            offsetRectY = translate([0, -offset1, 0], offsetRectY)

            offsetShape = union(
                offsetShape,
                offsetRectY,
            )
        }

        const cornerBit = align(
            { modes: ['min', 'min', 'center'] },
            offsetShape,
        )

        const fullBit = transform.cloneQuadrant(cornerBit)

        const mainModel = fullBit
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 2D cove bit.
     * @param {Object} opts - Options for the model
     * @param {number} opts.radius1 
     * @param {number} opts.radius2 
     * @param {number} opts.offset1 
     * @param {number} opts.offset2 
     * @param {number} opts.offset3 
     * @param {number} opts.offset4 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.beadsBits.corner
     */
    const cove = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            radius1,
            radius2,
            offset1,
            offset2,
            offset3,
            offset4,
        } = modelProperties.dims

        const baseEllipse = ellipse({ radius: [radius1, radius2] })
        const baseShape = transform.cutQuadrant(baseEllipse)
        let offsetRectX = null
        let offsetRectY = null
        let offsetShape = baseShape

        const hasOffsetRectX = offset1 && offset2

        if (hasOffsetRectX) {
            offsetRectX = rectangle({
                size: [radius1 + offset1, offset2]
            })

            offsetRectX = align(
                { modes: ['min', 'max', 'center'] },
                offsetRectX,
            )

            offsetShape = union(
                offsetShape,
                offsetRectX,
            )
        }

        if (offset3 && offset4) {
            const extraOffset = hasOffsetRectX ? offset2 : 0
            const nudgeDist = hasOffsetRectX ? -offset4 : 0

            offsetRectY = rectangle({
                size: [offset3, radius2 + offset4 + extraOffset]
            })

            offsetRectY = align(
                { modes: ['max', 'min', 'center'] },
                offsetRectY,
            )

            offsetRectY = translate([0, nudgeDist, 0], offsetRectY)

            offsetShape = union(
                offsetShape,
                offsetRectY,
            )
        }

        const cornerBit = align(
            { modes: ['min', 'min', 'center'] },
            offsetShape,
        )

        const fullBit = transform.cloneQuadrant(cornerBit)

        const mainModel = fullBit
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Modelling functions that generate 2D shapes which emulate woodworking router bits.
     * @namespace corner
     * @memberof profiles.beadsBits
     */
    const corner = {
        rabbet,
        chamfer,
        roundOver,
        cove,
    }

    return {
        corner,
    }
}

module.exports = {
    init: beadsBitsInit
}
