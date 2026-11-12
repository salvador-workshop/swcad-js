"use strict"

const reinforcedLineInit = ({ jscad, swcadJs }) => {
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
        const defaultValues = {
            constants: {
                interfaceThickness: standards.INTERFACE_THICKNESS,
            },
            opts: {},
            dims: {
                width: math.inchesToMm(5 / 16),
                height: math.inchesToMm(1 / 8),
                unitLength: math.inchesToMm(1),
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
            unitLength = defaults.opts.unitLength,
            baseThickness = defaults.opts.baseThickness,
            reinforcementThickness = defaults.opts.reinforcementThickness,
        } = opts

        const initOpts = {
            startPt,
            endPt,
            width,
            height,
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
     * New Model 1
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedLine
     */
    const lightReinforcedLine = (opts) => {
        const defaults = reinforcedLineDefaults()
        const initOpts = reinforcedLineOpts(opts)
        const modelProperties = reinforcedLineProps(initOpts)

        const {
            width,
            height,
            unitLength,
            baseThickness,
            reinforcementThickness,
            lineLength,
            offsetLineLength,
            lineComponentAngle,
        } = modelProperties.dims

        const {
            startPt,
            endPt,
            midPt,
        } = modelProperties.points

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * New Model 2
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedLine
     */
    const mediumReinforcedLine = (opts) => {
        const defaults = reinforcedLineDefaults()
        const initOpts = reinforcedLineOpts(opts)
        const modelProperties = reinforcedLineProps(initOpts)

        const {
            width,
            height,
            unitLength,
            baseThickness,
            reinforcementThickness,
            lineLength,
            offsetLineLength,
            lineComponentAngle,
        } = modelProperties.dims

        const {
            startPt,
            endPt,
            midPt,
        } = modelProperties.points

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedLine
     */
    const heavyReinforcedLine = (opts) => {
        const defaults = reinforcedLineDefaults()
        const initOpts = reinforcedLineOpts(opts)
        const modelProperties = reinforcedLineProps(initOpts)

        const {
            width,
            height,
            unitLength,
            baseThickness,
            reinforcementThickness,
            lineLength,
            offsetLineLength,
            lineComponentAngle,
        } = modelProperties.dims

        const {
            startPt,
            endPt,
            midPt,
        } = modelProperties.points

        const mainModel = cuboid()
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Modelling functions that generate new models
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
