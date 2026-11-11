"use strict"

/**
 * Modelling functions that generate curved 2D reinforcements for right-angle corners.
 * @memberof profiles.reinforcements
 * @namespace boxCurve
 */

const boxCurveInit = ({ jscad, swcadJs }) => {
    const {
        ellipse,
        rectangle,
    } = jscad.primitives

    const {
        align,
    } = jscad.transforms

    const {
        subtract,
    } = jscad.booleans

    const {
        standards,
    } = swcadJs.data

    const {
        math,
        position,
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * .reinforcements.boxCurve
     * @access private
     */
    const boxCurveDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            constants: {},
            opts: {},
            dims: {
                size: [
                    math.inchesToMm(2),
                    math.inchesToMm(4),
                ],
                margin: [
                    standards.INTERFACE_THICKNESS,
                    standards.INTERFACE_THICKNESS,
                    standards.INTERFACE_THICKNESS,
                ],
            },
            points: {},
            components: {},
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            size: defaultValues.dims.size,
            margin: defaultValues.dims.margin,
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
     * @memberof profiles.reinforcements.boxCurve
     * @access private
     */
    const boxCurveOpts = (opts) => {
        const defaults = boxCurveDefaults()

        // User options
        const {
            size = defaults.opts.size,
            margin = defaults.opts.margin,
        } = opts

        const initOpts = {
            size,
            margin,
        }

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof profiles.reinforcements.boxCurve
     * @access private
     */
    const boxCurveProps = (opts) => {
        const defaults = boxCurveDefaults()

        const {
            size,
            margin,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const width = size[0]
        const depth = size[1]
        const height = size[2]

        const marginWidth = margin[0]
        const marginDepth = margin[1]
        const marginHeight = margin[2]

        const ellipseRadiusQtr = [
            size[0] - marginWidth,
            size[1] - marginDepth,
        ]
        const ellipseRadiusHalf = [
            size[0] / 2 - marginWidth,
            size[1] - marginDepth,
        ]

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = defaults.vals.constants

        /** Derived user options for the model */
        const modelOpts = defaults.vals.opts

        /** Various dimensions for model */
        const modelDims = {
            size,
            margin,
            width,
            depth,
            height,
            marginWidth,
            marginDepth,
            marginHeight,
            ellipseRadiusQtr,
            ellipseRadiusHalf,
        }

        /** Various key points for model */
        const modelPoints = defaults.vals.points

        /** Components used by model */
        const modelComponents = defaults.vals.components

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

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * Generates a curved 2D reinforcement covering two sides (one corner) of a rectangle.
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {number[]} opts.margin
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.reinforcements.boxCurve
     */
    const boxCurveQuarter = (opts) => {
        const initOpts = boxCurveOpts(opts)
        const modelProperties = boxCurveProps(initOpts)
        const {
            size,
            ellipseRadiusQtr,
        } = modelProperties.dims

        const blank = rectangle({ size })
        const cutaway = ellipse({ radius: ellipseRadiusQtr })

        const cutCurve = subtract(
            align({
                modes: ['max', 'max', 'center'],
            }, blank),
            position.ctr(cutaway)
        )

        const mainModel = position.ctr(cutCurve)

        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a curved 2D reinforcement covering three sides (two corners) of a rectangle.
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {number[]} opts.margin
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.reinforcements.boxCurve
     */
    const boxCurveHalf = (opts) => {
        const initOpts = boxCurveOpts(opts)
        const modelProperties = boxCurveProps(initOpts)
        const {
            size,
            ellipseRadiusHalf,
        } = modelProperties.dims

        const blank = rectangle({ size })
        const cutaway = ellipse({ radius: ellipseRadiusHalf })

        const cutCurve = subtract(
            align({
                modes: ['center', 'max', 'center'],
            }, blank),
            position.ctr(cutaway),
        )

        const mainModel = position.ctr(cutCurve)

        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: boxCurveDefaults,
        props: boxCurveProps,
        boxCurveQuarter,
        boxCurveHalf,
    }
}

module.exports = {
    init: boxCurveInit
}
