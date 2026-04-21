"use strict"

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
        polygon,
        ellipse,
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
        math,
        position,
        transform,
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof profiles.beadsBits
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
            },
            types: {
                default: { id: 'default', desc: 'Default' },
                alt: { id: 'alt', desc: 'Alternate' },
            },
        }

        /** Options used by SW models */
        const standardOpts = {
            type: defaultValues.types.default.id,
            scale: 1,
            interfaceThickness: 1.333333,
            fitGap: math.inchesToMm(1 / 128),
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
     * @param {*} opts 
     * @returns model properties
     * @memberof profiles.beadsBits
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
            type = defaults.opts.type,
            scale = defaults.opts.scale,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
        } = opts

        const stdOpts = {
            type,
            scale,
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
     * @memberof profiles.beadsBits
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
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const lgProfileBeadWidth = interfaceThickness * 1.75
        const mdProfileBeadWidth = interfaceThickness * 1.5
        const smProfileBeadWidth = interfaceThickness * 1.125

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
            type,
            scale,
        }

        /** Derived user options for the model */
        const modelOpts = {
            type,
            scale,
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
            metadata: {
                id: '9999',
                name: 'New Model',
                project: 'New Project',
                author: 'Somebody Somewhere',
                organization: 'Salvador Workshop',
                client: null,
            },
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
     * Rabbet bit
     * @param {*} opts 
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
     * Chamfer bit
     * @param {*} opts 
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
     * Round-Over bit
     * @param {*} opts 
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
     * Cove bit
     * @param {*} opts 
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
     * Corner bits
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
