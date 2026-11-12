"use strict"

const reinforcedJoistLineInit = ({ jscad, swcadJs }) => {
    const {
        translate,
        rotate,
    } = jscad.transforms

    const {
        standards,
    } = swcadJs.data

    const {
        math,
        geometry,
    } = swcadJs.calcs

    const {
        reinforcements,
    } = swcadJs.components


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.reinforcements
     * @access private
     */
    const reinforcedJoistLineDefaults = () => {
        const defaultValues = {
            constants: {
                interfaceThickness: standards.INTERFACE_THICKNESS,
            },
            opts: {
                reinforcementLevel: 1,
            },
            dims: {
                width: math.inchesToMm(1.125),
                unitLength: math.inchesToMm(1),
                endOffset: 0,
            },
            points: {
                startPt: [0, 0],
                endPt: [math.inchesToMm(3), math.inchesToMm(4)],
            },
            components: {},
            types: {},
        }

        const defaultOpts = {
            startPt: defaultValues.points.startPt,
            endPt: defaultValues.points.endPt,
            width: defaultValues.dims.width,
            endOffset: defaultValues.dims.endOffset,
            unitLength: defaultValues.dims.unitLength,
            reinforcementLevel: defaultValues.opts.reinforcementLevel,
            interfaceThickness: defaultValues.constants.interfaceThickness,
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
    const reinforcedJoistLineOpts = (opts) => {
        const defaults = reinforcedJoistLineDefaults()
        console.log('reinforcedJoistLineOpts() -- opts', opts)

        // User options
        const {
            startPt = defaults.opts.startPt,
            endPt = defaults.opts.endPt,
            width = defaults.opts.width,
            endOffset = defaults.opts.endOffset,
            unitLength = defaults.opts.unitLength,
            reinforcementLevel = defaults.opts.reinforcementLevel,
            interfaceThickness = defaults.opts.interfaceThickness,
        } = opts

        const initOpts = {
            startPt,
            endPt,
            width,
            endOffset,
            unitLength,
            reinforcementLevel,
            interfaceThickness,
        }

        console.log('reinforcedJoistLineOpts() -- initOpts', initOpts)

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
    const reinforcedJoistLineProps = (opts) => {
        const defaults = reinforcedJoistLineDefaults()
        console.log('reinforcedJoistLineProps() -- prop opts', opts)

        const {
            startPt,
            endPt,
            width,
            endOffset,
            unitLength,
            reinforcementLevel,
            interfaceThickness,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const lineComponentDetails = geometry.lines.lineComponentDetails({
            startPt,
            endPt,
            endOffset,
        })

        const {
            midPt,
            lineLength,
            offsetLineLength,
            lineComponentAngle,
        } = lineComponentDetails

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = defaults.vals.constants

        /** Derived user options for the model */
        const modelOpts = {
            reinforcementLevel,
        }

        /** Various dimensions for model */
        const modelDims = {
            width,
            endOffset,
            unitLength,
            interfaceThickness,
            lineLength,
            offsetLineLength,
            lineComponentAngle,
        }

        /** Various key points for model */
        const modelPoints = {
            startPt,
            endPt,
            midPt,
        }

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

        console.log('reinforcedJoistLineProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * Modelling, Component/Assembly Modules
    * ------------------------------------- */

    /** Sub-component 01 */
    const reinfJoist = (modelProps) => {
        const {
            reinforcementLevel,
        } = modelProps.opts

        const {
            width,
            unitLength,
            interfaceThickness,
            offsetLineLength,
        } = modelProps.dims

        const rJoistOpts = {
            length: offsetLineLength,
            width,
            unitLength,
            reinforcementLevel,
            interfaceThickness,
        }
        const rJoist = reinforcements.reinforcedJoist(rJoistOpts)[0]

        return rJoist
    }

    /* ----------------------------------------
     * Complete Assembly
     * ------------------------------------- */

    /**
     * Generates a reinforced joist line
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.startPt
     * @param {number[]} opts.endPt
     * @param {number} opts.width
     * @param {number} opts.endOffset
     * @param {number} opts.unitLength
     * @param {number} opts.reinforcementLevel
     * @param {number} opts.interfaceThickness
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements
     */
    const reinforcedJoistLine = (opts) => {
        const initOpts = reinforcedJoistLineOpts(opts)
        const modelProperties = reinforcedJoistLineProps(initOpts)

        const {
            lineComponentAngle,
        } = modelProperties.dims

        const {
            midPt,
        } = modelProperties.points

        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */

        const reinforcedJoist = reinfJoist(modelProperties)

        let adjJoist = rotate([0, 0, lineComponentAngle], reinforcedJoist)
        adjJoist = translate(midPt, adjJoist)

        let mainModel = adjJoist

        let modelParts = {
            reinforcedJoist,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return reinforcedJoistLine
}

module.exports = {
    init: reinforcedJoistLineInit
}
