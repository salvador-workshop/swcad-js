"use strict"

const rectangularFittingInit = ({ jscad, swcadJs }) => {
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
        position,
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof rectangularFitting
     * @access private
     */
    const rectangularFittingDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            dims: {
                subjectSize: [
                    standards.crafts.POPSICLE_STICK_WIDTH,
                    standards.crafts.POPSICLE_STICK_THICKNESS,
                ],
                length: math.inchesToMm(1 / 4),
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
            subjectSize: defaultValues.dims.subjectSize,
            length: defaultValues.dims.length,
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
     * @memberof rectangularFitting
     * @access private
     */
    const rectangularFittingOpts = (opts) => {
        const defaults = rectangularFittingDefaults()
        console.log('rectangularFittingOpts() -- opts', opts)

        // User options
        const {
            subjectSize = defaults.opts.subjectSize,
            length = defaults.opts.length,
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
            subjectSize,
            length,
            ...stdOpts,
        }

        console.log('rectangularFittingOpts() -- initOpts', initOpts)

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof rectangularFitting
     * @access private
     */
    const rectangularFittingProps = (opts) => {
        const defaults = rectangularFittingDefaults()
        console.log('rectangularFittingProps() -- opts', opts)

        const {
            subjectSize,
            length,
            type,
            scale,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const subjectWidth = subjectSize[0]
        const subjectHeight = subjectSize[1]

        const width = subjectWidth + (interfaceThickness * 2)
        const height = subjectHeight / 3 + interfaceThickness

        const cutProfileWidth = subjectWidth + fitGap
        const cutProfileHeight = subjectHeight + fitGap

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
            subjectSize,
            subjectWidth,
            subjectHeight,
            length,
            width,
            height,
            cutProfileWidth,
            cutProfileHeight,
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

        console.log('rectangularFittingProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent
     */
    const rectFittingCutProfile = (opts) => {
        const defaults = rectangularFittingDefaults()
        const initOpts = rectangularFittingOpts(opts)
        const modelProperties = rectangularFittingProps(initOpts)

        const {
            cutProfileWidth,
            cutProfileHeight,
        } = modelProperties.dims

        const mainModel = rectangle({
            size: [
                cutProfileWidth,
                cutProfileHeight,
            ]
        })
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * New Model 1
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof newModelParent
     */
    const rectangularFitting = (opts) => {
        const defaults = rectangularFittingDefaults()
        const initOpts = rectangularFittingOpts(opts)
        const modelProperties = rectangularFittingProps(initOpts)

        const {
            subjectSize,
            subjectWidth,
            subjectHeight,
            length,
            width,
            height,
            interfaceThickness,
            fitGap,
        } = modelProperties.dims

        const baseRect = rectangle({
            size: [width, height]
        })

        const topCutaway = rectFittingCutProfile(opts)[0]

        const dHolderSection = subtract(
            align({
                modes: ['center', 'min', 'center'],
                relativeTo: [0, -interfaceThickness, 0]
            }, baseRect),
            align({ modes: ['center', 'min', 'center'] }, topCutaway),
        )

        let dHolder = extrudeLinear({ height: length }, dHolderSection)
        dHolder = rotate([Math.PI / 2, 0, 0], dHolder)

        const mainModel = position.ctr(dHolder)
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: rectangularFittingDefaults,
        props: rectangularFittingProps,
        rectFittingCutProfile,
        rectangularFitting,
    }
}

module.exports = {
    init: rectangularFittingInit
}
