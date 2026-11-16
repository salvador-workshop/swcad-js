"use strict"

const rectangleReinforcementsInit = ({ jscad, swcadJs }) => {
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
    const rectangleDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            opts: {
                reinforcementPatterns: ['x', 'cross', 'diamond', 'full', 'full-double'],
            },
            dims: {
                size: [40, 50],
            },
            points: {
                centre: [0, 0]
            }
        }


        /* ----------------------------------------
         * Options / Properties -- Input Handling
         * ------------------------------------- */

        /** Computed values for option defaults */
        const defaultOpts = {
            size: defaultValues.dims.size,
            reinforcementPattern: defaultValues.opts.reinforcementPatterns[0],
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
    const rectangleOpts = (opts) => {
        const defaults = rectangleDefaults()

        // User options
        const {
            size = defaults.opts.size,
            reinforcementPattern = defaults.opts.reinforcementPattern,
        } = opts

        const stdOpts = {
            size,
            reinforcementPattern,
        }

        const initOpts = {
            size,
            ...stdOpts,
        }

        return initOpts
    }


    //------------------------------------------------------------------------------


    const rectangleProps = (opts) => {
        const defaults = rectangleDefaults()

        const {
            size,
            reinforcementPattern,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const width = size[0]
        const length = size[1]

        const qtrX = width / 4
        const midX = width / 2
        const threeQtrX = qtrX + midX

        const qtrY = length / 4
        const midY = length / 2
        const threeQtrY = qtrY + midY

        const midPoint = [midX, midY]

        const corners = [
            [0, 0],
            [width, 0],
            [width, length],
            [0, length],
        ]

        const midPoints = [
            [midX, 0],
            [width, midY],
            [midX, length],
            [0, midY],
        ]

        const qtrPoints = [
            [qtrX, 0],
            [threeQtrX, 0],
            [0, qtrY],
            [0, threeQtrY],
            [qtrX, length],
            [threeQtrX, length],
            [width, qtrY],
            [width, threeQtrY],
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
                midPoint,
                corners[1],
            ],
            [
                midPoint,
                corners[3],
            ],
        ]

        const crossBraces = [
            [
                midPoints[0],
                midPoints[2],
            ],
            [
                midPoints[1],
                midPoints[3],
            ],
        ]

        const midBraces = [
            [
                midPoints[0],
                midPoints[1],
            ],
            [
                midPoints[1],
                midPoints[2],
            ],
            [
                midPoints[2],
                midPoints[3],
            ],
            [
                midPoints[3],
                midPoints[0],
            ],
        ]

        const doubleFullBraces = [
            [
                qtrPoints[0],
                qtrPoints[4],
            ],
            [
                qtrPoints[1],
                qtrPoints[5],
            ],
            [
                qtrPoints[2],
                qtrPoints[6],
            ],
            [
                qtrPoints[3],
                qtrPoints[7],
            ],
        ]

        let dots = []
        let lines = []
        let primaryLines = []
        let secondaryLines = []

        switch (reinforcementPattern) {
            case 'full-double':
                primaryLines = [
                    ...crossBraces,
                ]
                secondaryLines = [
                    ...midBraces,
                    ...diagBraces,
                    ...doubleFullBraces,
                ]
                lines = [
                    ...primaryLines,
                    ...secondaryLines,
                ]
                break;
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
            centre: midPoint,
            outline,
            midpoints: midPoints,
            braces: {
                cross: crossBraces,
                diagonal: diagBraces,
                mid: midBraces,
                doubleFull: doubleFullBraces,
            },
        }


        /* ---------------------------------------------
        *  Model Properties
        * ----------------------------------------------
        * Properties accessible to all model functions.
        * --------------------------------------------- */

        const modelProperties = {
            opts: modelOpts,
            dims: modelDims,
            points: modelPoints,
        }


        return modelProperties
    }


    //------------------------------------------------------------------------------


    /**
     * Calculates points and lines for a rectangule with internal reinforcements.
     * @memberof calcs.geometry.reinforcement
     * @param {Object} opts 
     * @param {number[]} opts.size - x and y coords
     * @param {string} opts.reinforcementPattern - one of ['x', 'cross', 'diamond', 'full', 'full-double']
     * @returns {Object.<string, object>} Modelling data (`opts`, `dims`, `points`)
     */
    const reinforcedRectangle = (opts) => {
        const initOpts = rectangleOpts(opts)
        const modelProperties = rectangleProps(initOpts)

        const data = {
            opts: modelProperties.opts,
            dims: modelProperties.dims,
            points: modelProperties.points,
        }

        return data
    }

    return reinforcedRectangle
}

module.exports = {
    init: rectangleReinforcementsInit
}
