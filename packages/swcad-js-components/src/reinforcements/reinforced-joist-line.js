"use strict"

const reinforcedJoistLineInit = ({ jscad, swcadJs }) => {
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
    const subcomponent1 = (modelProps) => {
        const {
            width,
            endOffset,
            unitLength,
            interfaceThickness,
            lineLength,
            offsetLineLength,
            lineComponentAngle,
        } = modelProps.dims

        const {
            startPt,
            endPt,
            midPt,
        } = modelProps.points

        return sphere()
    }

    /** Sub-component 02 */
    const subcomponent2 = (modelProps) => {
        const {
            width,
            endOffset,
            unitLength,
            interfaceThickness,
            lineLength,
            offsetLineLength,
            lineComponentAngle,
        } = modelProps.dims

        const {
            startPt,
            endPt,
            midPt,
        } = modelProps.points

        return cube()
    }

    /* ----------------------------------------
     * Complete Assembly
     * ------------------------------------- */

    /** Final Assembly */
    const finalAssembly = (modelProps) => {
        const {
            width,
            endOffset,
            unitLength,
            interfaceThickness,
            lineLength,
            offsetLineLength,
            lineComponentAngle,
        } = modelProps.dims

        const {
            startPt,
            endPt,
            midPt,
        } = modelProps.points

        let subComp1 = subcomponent1(modelProps)
        let subComp2 = subcomponent2(modelProps)

        return union(
            subComp1,
            subComp2,
        )
    }

    /**
     * Generates a new model
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {string} opts.type
     * @param {number} opts.reinforcementThickness
     * @param {number} opts.fitGap
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements
     */
    const reinforcedJoistLine = (opts) => {
        const defaults = reinforcedJoistLineDefaults()
        const initOpts = reinforcedJoistLineOpts(opts)
        const modelProperties = reinforcedJoistLineProps(initOpts)

        const {
            width,
            endOffset,
            unitLength,
            interfaceThickness,
            lineLength,
            offsetLineLength,
            lineComponentAngle,
        } = modelProperties.dims

        const {
            startPt,
            endPt,
            midPt,
        } = modelProperties.points

        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */

        let subComp1 = subcomponent1(modelProperties)
        let subComp2 = subcomponent2(modelProperties)

        let mainModel = finalAssembly(modelProperties)

        let modelParts = {
            subcomponent1: subComp1,
            subcomponent2: subComp2,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return reinforcedJoistLine
}

module.exports = {
    init: reinforcedJoistLineInit
}
