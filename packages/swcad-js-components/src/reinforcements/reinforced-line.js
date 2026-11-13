"use strict"

const reinforcedLineInit = ({ jscad, swcadJs }) => {
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
     * @memberof components.reinforcements.reinforcedLine
     * @access private
     */
    const reinforcedLineDefaults = () => {
        const defInterfaceThickness = standards.INTERFACE_THICKNESS

        const defaultValues = {
            constants: {
                interfaceThickness: defInterfaceThickness,
            },
            opts: {},
            dims: {
                width: math.inchesToMm(5 / 16),
                height: math.inchesToMm(1 / 8),
                unitLength: math.inchesToMm(1),
                endOffset: 0,
                baseThickness: defInterfaceThickness,
                reinforcementThickness: 1.125,
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
            height: defaultValues.dims.height,
            endOffset: defaultValues.dims.endOffset,
            unitLength: defaultValues.dims.unitLength,
            baseThickness: defaultValues.dims.baseThickness,
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
     * @memberof components.reinforcements.reinforcedLine
     * @access private
     */
    const reinforcedLineOpts = (opts) => {
        const defaults = reinforcedLineDefaults()
        console.log('reinforcedLineOpts() -- opts', opts)

        // User options
        const {
            startPt = defaults.opts.startPt,
            endPt = defaults.opts.endPt,
            width = defaults.opts.width,
            height = defaults.opts.height,
            endOffset = defaults.opts.endOffset,
            unitLength = defaults.opts.unitLength,
            baseThickness = defaults.opts.baseThickness,
            reinforcementThickness = defaults.opts.reinforcementThickness,
        } = opts

        const initOpts = {
            startPt,
            endPt,
            width,
            height,
            endOffset,
            unitLength,
            baseThickness,
            reinforcementThickness,
        }

        console.log('reinforcedLineOpts() -- initOpts', initOpts)

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof components.reinforcements.reinforcedLine
     * @access private
     */
    const reinforcedLineProps = (opts) => {
        const defaults = reinforcedLineDefaults()
        console.log('reinforcedLineProps() -- prop opts', opts)

        const {
            startPt,
            endPt,
            width,
            height,
            endOffset,
            unitLength,
            baseThickness,
            reinforcementThickness,
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
        const modelOpts = defaults.vals.opts

        /** Various dimensions for model */
        const modelDims = {
            width,
            height,
            endOffset,
            unitLength,
            baseThickness,
            reinforcementThickness,
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

        console.log('reinforcedLineProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * Generates a light reinforced line.
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.startPt
     * @param {number[]} opts.endPt
     * @param {number} opts.width
     * @param {number} opts.height
     * @param {number} opts.endOffset
     * @param {number} opts.unitLength
     * @param {number} opts.baseThickness
     * @param {number} opts.reinforcementThickness
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedLine
     */
    const lightReinforcedLine = (opts) => {
        const initOpts = reinforcedLineOpts(opts)
        const modelProperties = reinforcedLineProps(initOpts)

        const {
            width,
            height,
            unitLength,
            baseThickness,
            reinforcementThickness,
            offsetLineLength,
            lineComponentAngle,
        } = modelProperties.dims

        const {
            midPt,
        } = modelProperties.points

        const rOpts = {
            size: [
                offsetLineLength,
                width,
                height,
            ],
            unitLength,
            baseThickness,
            reinforcementThickness,
        }
        const lightReinfLength = reinforcements.reinforcedLength.lightReinforcedLength(rOpts)[0]

        let adjLightReinfLength = rotate([0, 0, lineComponentAngle], lightReinfLength)
        adjLightReinfLength = translate(midPt, adjLightReinfLength)

        const mainModel = adjLightReinfLength
        const modelParts = {
            mainModel,
            baseModel: lightReinfLength,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a medium reinforced line.
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.startPt
     * @param {number[]} opts.endPt
     * @param {number} opts.width
     * @param {number} opts.height
     * @param {number} opts.endOffset
     * @param {number} opts.unitLength
     * @param {number} opts.baseThickness
     * @param {number} opts.reinforcementThickness
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedLine
     */
    const mediumReinforcedLine = (opts) => {
        const initOpts = reinforcedLineOpts(opts)
        const modelProperties = reinforcedLineProps(initOpts)

        const {
            width,
            height,
            unitLength,
            baseThickness,
            reinforcementThickness,
            offsetLineLength,
            lineComponentAngle,
        } = modelProperties.dims

        const {
            midPt,
        } = modelProperties.points

        const rOpts = {
            size: [
                offsetLineLength,
                width,
                height,
            ],
            unitLength,
            baseThickness,
            reinforcementThickness,
        }
        const mediumReinfLength = reinforcements.reinforcedLength.mediumReinforcedLength(rOpts)[0]

        let adjMediumReinfLength = rotate([0, 0, lineComponentAngle], mediumReinfLength)
        adjMediumReinfLength = translate(midPt, adjMediumReinfLength)

        const mainModel = adjMediumReinfLength
        const modelParts = {
            mainModel,
            baseModel: mediumReinfLength,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a heavy reinforced line.
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.startPt
     * @param {number[]} opts.endPt
     * @param {number} opts.width
     * @param {number} opts.height
     * @param {number} opts.endOffset
     * @param {number} opts.unitLength
     * @param {number} opts.baseThickness
     * @param {number} opts.reinforcementThickness
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedLine
     */
    const heavyReinforcedLine = (opts) => {
        const initOpts = reinforcedLineOpts(opts)
        const modelProperties = reinforcedLineProps(initOpts)

        const {
            width,
            height,
            unitLength,
            baseThickness,
            reinforcementThickness,
            offsetLineLength,
            lineComponentAngle,
        } = modelProperties.dims

        const {
            midPt,
        } = modelProperties.points

        const rOpts = {
            size: [
                offsetLineLength,
                width,
                height,
            ],
            unitLength,
            baseThickness,
            reinforcementThickness,
        }
        const heavyReinfLength = reinforcements.reinforcedLength.heavyReinforcedLength(rOpts)[0]

        let adjHeavyReinfLength = rotate([0, 0, lineComponentAngle], heavyReinfLength)
        adjHeavyReinfLength = translate(midPt, adjHeavyReinfLength)

        const mainModel = adjHeavyReinfLength
        const modelParts = {
            mainModel,
            baseModel: heavyReinfLength,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Modelling functions that generate reinforced lines
     * @namespace reinforcedLine
     * @memberof components.reinforcements
     */
    return {
        defaults: reinforcedLineDefaults,
        props: reinforcedLineProps,
        lightReinforcedLine,
        mediumReinforcedLine,
        heavyReinforcedLine,
    }
}

module.exports = {
    init: reinforcedLineInit
}
