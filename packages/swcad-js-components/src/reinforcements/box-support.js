"use strict"

/**
 * Modelling functions that generate curved 3D reinforcements for right-angle corners.
 * @namespace boxSupport
 * @memberof components.reinforcements
 * @author R. J. Salvador (Salvador Workshop)
 */

const boxSupportInit = ({ jscad, swcadJs }) => {
    const { extrudeLinear } = jscad.extrusions

    const {
        standards,
    } = swcadJs.data

    const {
        math,
        position,
    } = swcadJs.calcs

    const {
        reinforcements,
    } = swcadJs.profiles


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.reinforcements.boxSupport
     * @access private
     */
    const boxSupportDefaults = () => {
        const defaultValues = {
            constants: {},
            opts: {},
            dims: {
                size: [
                    math.inchesToMm(2),
                    math.inchesToMm(4),
                    math.inchesToMm(1),
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
     * @memberof components.reinforcements.boxSupport
     * @access private
     */
    const boxSupportOpts = (opts) => {
        const defaults = boxSupportDefaults()

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
     * @memberof components.reinforcements.boxSupport
     * @access private
     */
    const boxSupportProps = (opts) => {
        const defaults = boxSupportDefaults()

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
            marginWidth * -2 + (size[0] / 2),
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
     * Generates a curved 3D reinforcement covering two sides (one corner) of a rectangle.
     * @memberof components.reinforcements.boxSupport
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {number[]} opts.margin
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     */
    const boxSupportQuarter = (opts) => {
        const initOpts = boxSupportOpts(opts)
        const modelProperties = boxSupportProps(initOpts)
        const {
            size,
            margin,
            marginHeight,
        } = modelProperties.dims

        const boxCurvesQtrData = reinforcements.boxCurve.boxCurveQuarter({
            size,
            margin,
        })
        const boxCurvesQtrModel = boxCurvesQtrData[0]

        const mainModel = position.ctr(extrudeLinear(
            { height: marginHeight },
            boxCurvesQtrModel
        ))

        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a curved 3D reinforcement covering three sides (two corners) of a rectangle.
     * @memberof components.reinforcements.boxSupport
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {number[]} opts.margin
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     */
    const boxSupportHalf = (opts) => {
        const initOpts = boxSupportOpts(opts)
        const modelProperties = boxSupportProps(initOpts)
        const {
            size,
            margin,
            marginHeight,
        } = modelProperties.dims

        const boxCurvesHalfData = reinforcements.boxCurve.boxCurveHalf({
            size,
            margin,
        })
        const boxCurvesHalfModel = boxCurvesHalfData[0]

        const mainModel = position.ctr(extrudeLinear(
            { height: marginHeight },
            boxCurvesHalfModel
        ))

        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: boxSupportDefaults,
        props: boxSupportProps,
        boxSupportQuarter,
        boxSupportHalf,
    }
}

module.exports = {
    init: boxSupportInit
}
