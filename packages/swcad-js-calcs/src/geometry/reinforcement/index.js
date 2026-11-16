"use strict"

const rectReinforcementModule = require('./rectangle-reinforcement');

/**
 * Calculations for reinforcement lines within a shape.
 * @namespace reinforcement
 * @memberof calcs.geometry
 */

const profReinforcementsInit = ({ jscad, swcadJs }) => {
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
            }
        }

        const defaultOpts = {
            size: defaultValues.dims.size,
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
        } = opts

        const stdOpts = {
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
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
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
            constants: modelConstants,
            opts: modelOpts,
            dims: modelDims,
            points: modelPoints,
            components: modelComponents,
        }


        return modelProperties
    }


    //------------------------------------------------------------------------------

    const reinforcedRectangle = rectReinforcementModule.init({ jscad, swcadJs })

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
        reinforcedRectangle,
    }
}

module.exports = {
    init: profReinforcementsInit
}
