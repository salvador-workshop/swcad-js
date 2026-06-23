"use strict"

const boxCurvesInit = ({ jscad, swcadJs }) => {
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
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof boxCurves
     * @access private
     */
    const boxCurvesDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
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
            points: {
                centrePt: [0, 0, 0]
            },
            types: {
                default: standards.types.TYPE_DEFAULT,
                alt: standards.types.TYPE_ALT,
            },
        }

        /** Options used by SW models */
        const standardOpts = {
            type: defaultValues.types.default.id,
            scale: 1,
            interfaceThickness: standards.INTERFACE_THICKNESS,
            fitGap: standards.FIT_GAP,
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            ...standardOpts,
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
     * @memberof boxCurves
     * @access private
     */
    const boxCurvesOpts = (opts) => {
        const defaults = boxCurvesDefaults()
        console.log('boxCurvesOpts() -- opts', opts)

        // User options
        const {
            size = defaults.opts.size,
            margin = defaults.opts.margin,
            type = defaults.opts.type,
            scale = defaults.opts.scale,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
        } = opts

        const stdOpts = {
            type,
            scale,
            interfaceThickness,
            fitGap,
        }

        const initOpts = {
            size,
            margin,
            ...stdOpts,
        }

        console.log('boxCurvesOpts() -- initOpts', initOpts)

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof boxCurves
     * @access private
     */
    const boxCurvesProps = (opts) => {
        const defaults = boxCurvesDefaults()
        console.log('boxCurvesProps() -- opts', opts)

        const {
            size,
            margin,
            type,
            scale,
            interfaceThickness,
            fitGap,
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
        const modelConstants = {
        }

        /** Derived user options for the model */
        const modelOpts = {
            type,
            scale,
        }

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
            interfaceThickness,
            fitGap,
        }

        /** Various key points for model */
        const modelPoints = {
            centrePt: defaults.vals.points.centrePt,
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
            metadata: {
                id: '9999',
                name: 'New Model',
                project: 'New Project',
                author: 'Somebody Somewhere',
                organization: 'Salvador Workshop',
                client: null,
            },
            constants: modelConstants,
            opts: modelOpts,
            dims: modelDims,
            points: modelPoints,
            components: modelComponents,
        }

        console.log('boxCurvesProps() -- modelProperties', modelProperties)

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
     * @memberof newModelParent
     */
    const boxCurveQuarter = (opts) => {
        const defaults = boxCurvesDefaults()
        const initOpts = boxCurvesOpts(opts)
        const modelProperties = boxCurvesProps(initOpts)
        const {
            size,
            margin,
            ellipseRadiusQtr,
        } = modelProperties.dims

        const blank = rectangle({ size })
        const cutaway = ellipse({ radius: ellipseRadiusQtr })

        const mainModel = subtract(
            align({
                modes: ['max', 'max', 'center'],
            }, blank),
            align({
                modes: ['center', 'center', 'center'],
            }, cutaway),
        )

        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * New Model 2
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent
     */
    const boxCurveHalf = (opts) => {
        const defaults = boxCurvesDefaults()
        const initOpts = boxCurvesOpts(opts)
        const modelProperties = boxCurvesProps(initOpts)
        const {
            size,
            margin,
            ellipseRadiusHalf,
        } = modelProperties.dims

        const blank = rectangle({ size })
        const cutaway = ellipse({ radius: ellipseRadiusHalf })

        const mainModel = subtract(
            align({
                modes: ['center', 'max', 'center'],
            }, blank),
            align({
                modes: ['center', 'center', 'center'],
            }, cutaway),
        )

        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: boxCurvesDefaults,
        props: boxCurvesProps,
        boxCurveQuarter,
        boxCurveHalf,
    }
}

module.exports = {
    init: boxCurvesInit
}
