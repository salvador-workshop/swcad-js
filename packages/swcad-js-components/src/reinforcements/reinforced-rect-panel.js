"use strict"

const reinforcedRectPanelInit = ({ jscad, swcadJs }) => {
    const {
        extrudeLinear,
    } = jscad.extrusions

    const {
        math,
        position,
    } = swcadJs.calcs

    const {
        standards,
    } = swcadJs.data

    const {
        reinforcements,
    } = swcadJs.profiles


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.reinforcements
     * @access private
     */
    const reinforcedRectPanelDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            constants: {
                reinforcementPatterns: ['x', 'cross', 'diamond', 'full', 'full-double'],
            },
            opts: {},
            dims: {
                size: [
                    math.inchesToMm(3),
                    math.inchesToMm(4),
                    standards.INTERFACE_THICKNESS,
                ],
                reinforcementThickness: [5, 4, 3],
            },
            points: {},
            components: {},
        }

        const defaultOpts = {
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
     * @memberof components.reinforcements
     * @access private
     */
    const reinforcedRectPanelOpts = (opts) => {
        const defaults = reinforcedRectPanelDefaults()

        // User options
        const {
            size = defaults.opts.size,
            reinforcementPattern = defaults.opts.reinforcementPattern,
            reinforcementThickness = defaults.opts.reinforcementThickness,
        } = opts

        const initOpts = {
            size,
            reinforcementPattern,
            reinforcementThickness,
        }


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
    const reinforcedRectPanelProps = (opts) => {
        const defaults = reinforcedRectPanelDefaults()

        const {
            size,
            reinforcementPattern,
            reinforcementThickness,
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
        const modelConstants = defaults.vals.constants

        /** Derived user options for the model */
        const modelOpts = {
            reinforcementPattern,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            width,
            depth,
            height,
            reinforcementThickness,
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


    /**
     * Generates a reinforced 3D rectangular panel with the given options for reinforcement styles.
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {string} opts.reinforcementPattern
     * @param {number[]} opts.reinforcementThickness
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements
     */
    const reinforcedRectPanel = (opts) => {
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
        const reinforcedRect = reinforcements.reinforcedRect(reinforcedRectOpts)[0]
        const extrudedReinforcedRect = position.ctr(extrudeLinear(
            { height: size[2] },
            reinforcedRect
        ))

        const mainModel = extrudedReinforcedRect
        const modelParts = {
            mainModel,
            profile: reinforcedRect,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return reinforcedRectPanel
}

module.exports = {
    init: reinforcedRectPanelInit
}
