"use strict"

const bracketsInit = ({ jscad, swcadJs }) => {
    const {
        rectangle,
    } = jscad.primitives

    const {
        align,
        rotate,
    } = jscad.transforms

    const {
        subtract,
    } = jscad.booleans

    const {
        extrudeLinear,
    } = jscad.extrusions

    const {
        standards,
    } = swcadJs.data

    const {
        math,
        position,
    } = swcadJs.calcs

    const {
        reinforcements
    } = swcadJs.components


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.reinforcements
     * @access private
     */
    const bracketsDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            dims: {
                size: [
                    math.inchesToMm(1.5),
                    math.inchesToMm(0.5),
                    math.inchesToMm(0.5),
                ],
            },
            points: {},
            types: {},
            constants: {}
        }

        /** Options used by SW models */
        const standardOpts = {
            interfaceThickness: standards.INTERFACE_THICKNESS,
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


    //------------------------------------------------------------------------------


    /**
     * Initializes options with user input
     * @param {*} opts 
     * @returns model properties
     * @memberof components.reinforcements
     * @access private
     */
    const bracketsOpts = (opts) => {
        const defaults = bracketsDefaults()
        console.log('bracketsOpts() -- opts', opts)

        // User options
        const {
            size = defaults.opts.size,
            interfaceThickness = defaults.opts.interfaceThickness,
        } = opts

        const stdOpts = {
            interfaceThickness,
        }

        const initOpts = {
            size,
            ...stdOpts,
        }

        console.log('bracketsOpts() -- initOpts', initOpts)

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof components.reinforcements
     * @access private
     */
    const bracketsProps = (opts) => {
        const defaults = bracketsDefaults()
        console.log('bracketsProps() -- opts', opts)

        const {
            size,
            interfaceThickness,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const length = size[0]
        const width = size[1]
        const height = size[2]

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {}

        /** Derived user options for the model */
        const modelOpts = {}

        /** Various dimensions for model */
        const modelDims = {
            size,
            length,
            width,
            height,
            interfaceThickness,
        }

        /** Various key points for model */
        const modelPoints = {}

        /** Components used by model */
        const modelComponents = {}

        /* ---------------------------------------------
        *  Model Properties
        * ----------------------------------------------
        * Properties accessible to all model functions.
        * --------------------------------------------- */

        const modelProperties = {
            metadata: {},
            constants: modelConstants,
            opts: modelOpts,
            dims: modelDims,
            points: modelPoints,
            components: modelComponents,
        }

        console.log('bracketsProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * Generates a fitting for square/rectangular dowels.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {string} opts.type - Type of the model
     * @param {number} opts.scale - Scale factor for the model
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements
     */
    const rightAngleBracket = (opts) => {
        const defaults = bracketsDefaults()
        const initOpts = bracketsOpts(opts)
        const modelProperties = bracketsProps(initOpts)

        const {
            length,
            width,
            height,
            interfaceThickness,
        } = modelProperties.dims

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a fitting for square/rectangular dowels.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {string} opts.type - Type of the model
     * @param {number} opts.scale - Scale factor for the model
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements
     */
    const rightAngleCornerBracket = (opts) => {
        const defaults = bracketsDefaults()
        const initOpts = bracketsOpts(opts)
        const modelProperties = bracketsProps(initOpts)

        const {
            length,
            width,
            height,
            interfaceThickness,
        } = modelProperties.dims

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: bracketsDefaults,
        props: bracketsProps,
        rightAngleBracket,
        rightAngleCornerBracket,
    }
}

module.exports = {
    init: bracketsInit
}
