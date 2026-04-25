"use strict"

const reinforcedRectPanelInit = ({ jscad, swcadJs }) => {
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
        math,
    } = swcadJs.calcs

    const {
        shapes,
    } = swcadJs.profiles


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.reinforcedRectPanel
     * @access private
     */
    const reinforcedRectPanelDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            constants: {
                reinforcementPatterns: ['x', 'cross', 'diamond', 'full'],
            },
            dims: {
                size: [
                    math.inchesToMm(3),
                    math.inchesToMm(4),
                    math.inchesToMm(1 / 8),
                ],
                reinforcementThickness: [5, 4, 3],
            },
            points: {
                centrePt: [0, 0, 0]
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
            size: defaultValues.dims.size,
            reinforcementPattern: defaultValues.constants.reinforcementPatterns[0],
            reinforcementThickness: defaultValues.dims.reinforcementThickness,
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
     * @memberof components.reinforcedRectPanel
     * @access private
     */
    const reinforcedRectPanelOpts = (opts) => {
        const defaults = reinforcedRectPanelDefaults()
        console.log('modelOpts() -- opts', opts)

        // User options
        const {
            size = defaults.opts.size,
            reinforcementPattern = defaults.opts.reinforcementPattern,
            reinforcementThickness = defaults.opts.reinforcementThickness,
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
            size,
            reinforcementPattern,
            reinforcementThickness,
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
     * @memberof components.reinforcedRectPanel
     * @access private
     */
    const reinforcedRectPanelProps = (opts) => {
        const defaults = reinforcedRectPanelDefaults()
        console.log('modelProps() -- opts', opts)

        const {
            size,
            reinforcementPattern,
            reinforcementThickness,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const width = size[0]
        const depth = size[1]
        const height = size[2]

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
        }

        /** Derived user options for the model */
        const modelOpts = {
            type,
            scale,
            reinforcementPattern,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            width,
            depth,
            height,
            reinforcementThickness,
            interfaceThickness,
            fitGap,
        }

        /** Various key points for model */
        const modelPoints = {
            centrePt: defaults.vals.points.centrePt,
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


    //------------------------------------------------------------------------------


    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components
     */
    const reinforcedRectPanel = (opts) => {
        const defaults = reinforcedRectPanelDefaults()
        const initOpts = reinforcedRectPanelOpts(opts)
        const modelProperties = reinforcedRectPanelProps(initOpts)

        const {
            reinforcementPattern,
        } = modelProperties.opts

        const {
            size,
            reinforcementThickness,
        } = modelProperties.dims

        const reinforcedRectOpts = {
            size: [size[0], size[1]],
            reinforcementPattern,
            reinforcementThickness,
        }
        const reinforcedRect = shapes.rectangle.reinforcedRect(reinforcedRectOpts)[0]
        const extrudedReinforcedRect = extrudeLinear({ height: size[2] }, reinforcedRect)

        const mainModel = extrudedReinforcedRect
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return reinforcedRectPanel
}

module.exports = {
    init: reinforcedRectPanelInit
}
