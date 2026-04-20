"use strict"

/**
 * Beads and Bits
 * @namespace beadsBits
 * @memberof components 
 * @author R. J. Salvador (Salvador Workshop)
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
    } = swcadJs.data

    const {
        math,
        position,
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
     * @memberof components.beadsBits
     * @access private
     */
    const modelOpts = (opts) => {
        const defaults = modelDefaults()
        console.log('modelOpts() -- opts', opts)

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
        console.log('modelOpts() -- initOpts', initOpts)

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
        console.log('modelProps() -- opts', opts)

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

        console.log('modelProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    /**
     * Rabbet bit
     * @param {*} opts 
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
     * Chamfer bit
     * @param {*} opts 
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
     * Round-Over Bit
     * @param {*} opts 
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
     * Cove bit
     * @param {*} opts 
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
     * Corner bits
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
 * Standard bead profiles for interface connections
 * @param {number} baseThickness - Thickness of the bead profile
 * @param {number} smWidth - Width of the small bead profile
 * @param {number} mdWidth - Width of the medium bead profile
 * @param {number} lgWidth - Width of the large bead profile
 * @returns {Object<string, geom3>} - Small, Medium, and Large bead profiles
 * @memberof components.beadsBits
 */
    const profileBeads = (baseThickness, smWidth, mdWidth, lgWidth) => {
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
        profileBeads,
        corner,
    }
}


module.exports = {
    init: beadsBitsInit
}
