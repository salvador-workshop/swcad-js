"use strict"

/**
 * Reinforcement layout for basic geometries (rectangle, triangle, ellipse)
 * @namespace reinforcement
 * @memberof calcs.geometry
 * @author R. J. Salvador
 * @version 1.0.0
 * @requires jscad v2, swcad-js v0.11.8
 */

const profReinforcementsInit = ({ jscad, swcadJs }) => {
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


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof calcs.geometry.reinforcement
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
            size: defaultValues.dims.size,
        }

        return {
            opts: defaultOpts,
            vals: defaultValues,
        }
    }

    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof calcs.geometry.reinforcement
     * @access private
     */
    const rectangleDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            opts: {
                reinforcementPatterns: ['x', 'cross', 'diamond', 'full'],
            },
            dims: {
                size: [40, 50],
            },
            points: {
                centre: [0, 0]
            },
            typeDetails: {
                default: { id: 'default', desc: 'Default' },
                alt: { id: 'alt', desc: 'Alternate' },
            }
        }


        /* ----------------------------------------
         * Options / Properties -- Input Handling
         * ------------------------------------- */

        /** Computed values for option defaults */
        const defaultOpts = {
            size: defaultValues.dims.size,
            reinforcementPattern: defaultValues.opts.reinforcementPatterns[0],
            interfaceThickness: 1.333333,
            fitGap: math.inchesToMm(1 / 128),
            type: 'default',
            scale: 1,
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
     * @memberof calcs.geometry.reinforcement
     * @access private
     */
    const modelOpts = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            size = defaults.opts.size,
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
            ...stdOpts,
        }


        return initOpts
    }

    /**
     * Initializes options with user input
     * @param {*} opts 
     * @returns model properties
     * @memberof calcs.geometry.reinforcement
     * @access private
     */
    const rectangleOpts = (opts) => {
        const defaults = rectangleDefaults()

        // User options
        const {
            size = defaults.opts.size,
            reinforcementPattern = defaults.opts.reinforcementPattern,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
            type = defaults.opts.type,
            scale = defaults.opts.scale,
        } = opts

        const stdOpts = {
            size,
            reinforcementPattern,
            interfaceThickness,
            fitGap,
            type,
            scale,
        }

        const initOpts = {
            size,
            ...stdOpts,
        }


        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof calcs.geometry.reinforcement
     * @access private
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()

        const {
            size,
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
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            interfaceThickness,
            fitGap,
            width,
            depth,
            height,
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

    const rectangleProps = (opts) => {
        const defaults = rectangleDefaults()

        const {
            size,
            reinforcementPattern,
            interfaceThickness,
            fitGap,
            type,
            scale,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const width = size[0]
        const length = size[1]

        const midX = width / 2
        const midY = length / 2
        const midpoint = [midX, midY]

        const corners = [
            [0, 0],
            [width, 0],
            [width, length],
            [0, length],
        ]

        const midpoints = [
            [midX, 0],
            [width, midY],
            [midX, length],
            [0, midY],
        ]

        const outline = [
            [
                corners[0],
                corners[1],
            ],
            [
                corners[1],
                corners[2],
            ],
            [
                corners[2],
                corners[3],
            ],
            [
                corners[3],
                corners[0],
            ],
        ]

        const diagBraces = [
            [
                corners[0],
                corners[2],
            ],
            [
                midpoint,
                corners[1],
            ],
            [
                midpoint,
                corners[3],
            ],
        ]

        const crossBraces = [
            [
                midpoints[0],
                midpoints[2],
            ],
            [
                midpoints[1],
                midpoints[3],
            ],
        ]

        const midBraces = [
            [
                midpoints[0],
                midpoints[1],
            ],
            [
                midpoints[1],
                midpoints[2],
            ],
            [
                midpoints[2],
                midpoints[3],
            ],
            [
                midpoints[3],
                midpoints[0],
            ],
        ]

        let dots = []
        let lines = []
        let primaryLines = []
        let secondaryLines = []

        switch (reinforcementPattern) {
            case 'full':
                primaryLines = [
                    ...crossBraces,
                ]
                secondaryLines = [
                    ...midBraces,
                    ...diagBraces,
                ]
                lines = [
                    ...primaryLines,
                    ...secondaryLines,
                ]
                break;
            case 'diamond':
                primaryLines = [
                    ...crossBraces,
                ]
                secondaryLines = [
                    ...midBraces,
                ]
                lines = [
                    ...primaryLines,
                    ...secondaryLines,
                ]
                break;
            case 'cross':
                primaryLines = [
                    ...crossBraces,
                ]
                secondaryLines = [
                    ...diagBraces,
                ]
                lines = [
                    ...primaryLines,
                    ...secondaryLines,
                ]
                break;
            case 'x':
            default:
                primaryLines = [
                    ...diagBraces,
                ]
                secondaryLines = []
                lines = [
                    ...primaryLines,
                    ...secondaryLines,
                ]
                break;
        }

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Derived user options for the model */
        const modelOpts = {
            reinforcementPattern,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            width,
            length,
        }

        /** Various key points for model */
        const modelPoints = {
            corners,
            lines,
            primaryLines,
            secondaryLines,
            centre: midpoint,
            outline,
            midpoints,
            braces: {
                cross: crossBraces,
                diagonal: diagBraces,
                mid: midBraces,
            },
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
            opts: modelOpts,
            dims: modelDims,
            points: modelPoints,
        }


        return modelProperties
    }


    //------------------------------------------------------------------------------


    /**
     * New Model 2
     * @param {*} opts 
     * @returns Modelling data
     * @memberof calcs.geometry.reinforcement
     * @access private
     */

    const reinforcedTriangle = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const data = {
            points: null
        }

        return data
    }

    /**
     * New Model 1
     * @param {*} opts 
     * @returns Modelling data
     * @memberof calcs.geometry.reinforcement
     */
    const reinforcedRectangle = (opts) => {
        const defaults = rectangleDefaults()
        const initOpts = rectangleOpts(opts)
        const modelProperties = rectangleProps(initOpts)

        const data = {
            opts: modelProperties.opts,
            dims: modelProperties.dims,
            points: modelProperties.points,
        }

        return data
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Modelling data
     * @memberof calcs.geometry.reinforcement
     * @access private
     */
    const reinforcedEllipse = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const data = {
            points: null
        }

        return data
    }

    return {
        defaults: modelDefaults,
        props: modelProps,
        reinforcedTriangle,
        reinforcedRectangle,
        reinforcedEllipse,
    }
}

module.exports = {
    init: profReinforcementsInit
}
