"use strict"

const jointPanelsInit = ({ jscad, swcadJs }) => {
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
        math,
    } = swcadJs.calcs

    const {
        connections,
    } = swcadJs.profiles


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof newModelName
     * @access private
     */
    const modelDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            constants: {
                sampleThickness: 1, // scission only works with 3D objects. Need a filler thickness for now
            },
            opts: {
                axis: 'x'
            },
            dims: {
                size: [
                    math.inchesToMm(2),
                    math.inchesToMm(4),
                    math.inchesToMm(1),
                ],
                jointWidth: math.inchesToMm(3 / 8),
                jointMargin: math.inchesToMm(1 / 8),
            },
            points: {
                centre: [0, 0, 0]
            },
            types: {
                default: { id: 'default', desc: 'Default' },
                alt: { id: 'alt', desc: 'Alternate' },
            },
        }

        /** Options used by SW models */
        const standardOpts = {
            type: defaultValues.types.default.id,
            scale: 1,
            interfaceThickness: 1.333333,
            fitGap: math.inchesToMm(1 / 128),
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            ...standardOpts,
            size: defaultValues.dims.size,
            jointWidth: defaultValues.dims.jointWidth,
            jointMargin: defaultValues.dims.jointMargin,
            axis: defaultValues.opts.axis,
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
     * @memberof newModelName
     * @access private
     */
    const modelOpts = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            size = defaults.opts.size,
            jointWidth = defaults.opts.jointWidth,
            jointMargin = defaults.opts.jointMargin,
            axis = defaults.opts.axis,
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
            jointWidth,
            jointMargin,
            axis,
            ...stdOpts,
        }


        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof newModelName
     * @access private
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()

        const {
            size,
            jointWidth,
            jointMargin,
            axis,
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

        const midPoint = [
            width / 2,
            depth / 2,
        ]

        const totalJointWidth = jointMargin * 2 + jointWidth

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
            sampleThickness: defaults.vals.constants.sampleThickness,
        }

        /** Derived user options for the model */
        const modelOpts = {
            type,
            scale,
            axis,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            width,
            depth,
            jointWidth,
            jointMargin,
            totalJointWidth,
            interfaceThickness,
            fitGap,
        }

        /** Various key points for model */
        const modelPoints = {
            centrePt: midPoint,
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


        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    const oneJointRectPanel = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            sampleThickness
        } = modelProperties.constants

        const {
            axis,
        } = modelProperties.opts

        const {
            size,
            width,
            depth,
            jointWidth,
            jointMargin,
            totalJointWidth,
        } = modelProperties.dims

        const {
            centrePt
        } = modelProperties.points

        // along X axis
        let jointSize = [width, totalJointWidth]

        if (axis == 'y') {
            // along Y axis
            jointSize = [depth, totalJointWidth]
        }

        const jointData = connections.dovetailRow({
            size: jointSize,
        })
        const jointCut = jointData[1].cut
        const oneJointRectBasePanel = cuboid({
            size: [width, depth, sampleThickness],
            center: [centrePt[0], centrePt[1], 0]
        })

        const cutPanel = subtract(
            oneJointRectBasePanel,
            jointCut
        )
        const cutParts = scission(cutPanel)
        const oProfiles = [
            align({ modes: ['center', 'center', 'center'] }, cutParts[1]),
            align({ modes: ['center', 'center', 'center'] }, cutParts[0]),
        ]
        const outProfiles = [
            project({}, oProfiles[0]),
            project({}, oProfiles[1]),
        ]

        const mainModel = [
            outProfiles[0],
            outProfiles[1],
        ]

        const modelParts = {
            male: outProfiles[0],
            female: outProfiles[1],
            cut: jointCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    const twoJointRectPanel = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            sampleThickness
        } = modelProperties.constants

        const {
            axis,
        } = modelProperties.opts

        const {
            size,
            width,
            depth,
            jointWidth,
            jointMargin,
            totalJointWidth,
        } = modelProperties.dims

        const {
            centrePt
        } = modelProperties.points

        // along X axis
        const jointSizeX = [width, totalJointWidth]
        // along Y axis
        const jointSizeY = [depth, totalJointWidth]

        const jointDataX = connections.dovetailRow({
            size: jointSizeX,
        })
        const jointCutX = jointDataX[1].cut

        const jointDataY = connections.dovetailRow({
            size: jointSizeY,
        })
        const jointCutY = rotate([0, 0, TAU / 4], jointDataY[1].cut)

        const comboCut = union(jointCutX, jointCutY)

        const twoJointRectBasePanel = cuboid({
            size: [width, depth, sampleThickness],
            center: [centrePt[0], centrePt[1], 0]
        })

        const cutPanel = subtract(
            twoJointRectBasePanel,
            comboCut,
        )
        const cutParts = scission(cutPanel)
        const oProfiles = [
            align({ modes: ['center', 'center', 'center'] }, cutParts[1]),
            align({ modes: ['center', 'center', 'center'] }, cutParts[0]),
        ]
        const outProfiles = [
            project({}, oProfiles[0]),
            project({}, oProfiles[1]),
        ]

        const mainModel = [
            outProfiles[0],
            outProfiles[1],
        ]

        const modelParts = {
            male: outProfiles[0],
            female: outProfiles[1],
            cut: comboCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: modelDefaults,
        props: modelProps,
        oneJointRectPanel,
        twoJointRectPanel,
    }
}

module.exports = {
    init: jointPanelsInit
}
