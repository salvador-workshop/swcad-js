"use strict"

const bracketsInit = ({ jscad, swcadJs }) => {
    const {
        rectangle,
        cuboid
    } = jscad.primitives

    const {
        align,
        rotate,
        translate,
    } = jscad.transforms

    const {
        subtract,
        union,
    } = jscad.booleans

    const {
        extrudeLinear,
    } = jscad.extrusions

    const {
        measureDimensions,
        measureBoundingBox,
        measureVolume
    } = jscad.measurements

    const { TAU } = jscad.maths.constants

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
                    math.inchesToMm(0.75),
                ],
            },
            opts: {
                numReinforcements: 4,
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
            numReinforcements: defaultValues.opts.numReinforcements,
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
            numReinforcements = defaults.opts.numReinforcements,
            interfaceThickness = defaults.opts.interfaceThickness,
        } = opts

        const stdOpts = {
            interfaceThickness,
        }

        const initOpts = {
            size,
            numReinforcements,
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
            numReinforcements,
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
        const modelOpts = {
            numReinforcements,
        }

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
            numReinforcements,
        } = modelProperties.opts

        const {
            size,
            length,
            width,
            height,
            interfaceThickness,
        } = modelProperties.dims

        let bracketReinf = reinforcements.boxSupport.boxSupportQuarter({
            size: [height, width],
        })[0]
        bracketReinf = position.ctrMin(rotate([0, TAU / -4, 0], bracketReinf))

        const reinforcementsPtsLength = length - interfaceThickness
        const reinforcementsSpacing = reinforcementsPtsLength / (numReinforcements - 1)
        const bracketReinforcements = []
        for (let bReinfIdx = 0; bReinfIdx < numReinforcements; bReinfIdx++) {
            const currentOffset = [reinforcementsSpacing * bReinfIdx, 0, 0]
            bracketReinforcements.push(translate(
                currentOffset,
                bracketReinf
            ))
        }
        const bracketReinforcementsAssembly = union(
            ...bracketReinforcements
        )

        const sidePanel = cuboid({ size: [length, interfaceThickness, height] })
        const basePanel = cuboid({ size: [length, width, interfaceThickness] })
        const bracketBodyBase = union(
            align({ modes: ['center', 'min', 'min'] }, sidePanel),
            align({ modes: ['center', 'min', 'min'] }, basePanel)
        )

        const rightAngleBracketAssembly = union(
            bracketBodyBase,
            align({ modes: ['center', 'min', 'min'] }, bracketReinforcementsAssembly)
        )

        const mainModel = rightAngleBracketAssembly
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
            numReinforcements,
        } = modelProperties.opts

        const {
            size,
            length,
            width,
            height,
            interfaceThickness,
        } = modelProperties.dims

        const sidePanelX = cuboid({ size: [length, interfaceThickness, height] })
        const sidePanelY = cuboid({ size: [interfaceThickness, width, height] })
        const basePanel = cuboid({ size: [length, width, interfaceThickness] })

        const cornerBracketBodyBase = union(
            align({ modes: ['min', 'min', 'min'] }, sidePanelX),
            align({ modes: ['min', 'min', 'min'] }, sidePanelY),
            align({ modes: ['min', 'min', 'min'] }, basePanel)
        )

        let numReinfs = numReinforcements;
        if (typeof jointNumConnectors == "number") {
            numReinfs = [
                numReinforcements,
                numReinforcements
            ];
        }

        let bracketReinfX = reinforcements.boxSupport.boxSupportQuarter({
            size: [height, width / 2],
        })[0]
        bracketReinfX = position.ctrMin(rotate([0, TAU / -4, 0], bracketReinfX))

        const reinforcementsPtsLengthX = length - interfaceThickness
        const reinforcementsSpacingX = reinforcementsPtsLengthX / numReinfs[0]
        const bracketReinforcementsX = []
        for (let bReinfXIdx = 0; bReinfXIdx < numReinfs[0]; bReinfXIdx++) {
            const currentOffset = [reinforcementsSpacingX * bReinfXIdx, 0, 0]
            bracketReinforcementsX.push(translate(
                currentOffset,
                bracketReinfX
            ))
        }
        const bracketReinforcementsXAssembly = union(
            ...bracketReinforcementsX
        )

        let bracketReinfY = reinforcements.boxSupport.boxSupportQuarter({
            size: [height, length / 2],
        })[0]
        bracketReinfY = position.ctrMin(rotate([0, TAU / -4, TAU / -4], bracketReinfY))

        const reinforcementsPtsLengthY = width - interfaceThickness
        const reinforcementsSpacingY = reinforcementsPtsLengthY / numReinfs[1]
        const bracketReinforcementsY = []
        for (let bReinfYIdx = 0; bReinfYIdx < numReinfs[1]; bReinfYIdx++) {
            const currentOffset = [0, reinforcementsSpacingY * bReinfYIdx, 0]
            bracketReinforcementsY.push(translate(
                currentOffset,
                bracketReinfY
            ))
        }
        const bracketReinforcementsYAssembly = union(
            ...bracketReinforcementsY
        )

        const cornerBracketBodyBaseBbox = measureBoundingBox(cornerBracketBodyBase)
        const xAssemblyPt = [cornerBracketBodyBaseBbox[1][0], 0, 0]
        const yAssemblyPt = [0, cornerBracketBodyBaseBbox[1][1], 0]

        const cornerBracketAssembly = union(
            cornerBracketBodyBase,
            align({
                modes: ['max', 'min', 'min'],
                relativeTo: xAssemblyPt
            }, bracketReinforcementsXAssembly),
            align({
                modes: ['min', 'max', 'min'],
                relativeTo: yAssemblyPt
            }, bracketReinforcementsYAssembly),
        )

        const mainModel = cornerBracketAssembly
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
