"use strict"

/**
 * Connection Profiles
 * @author R. J. Salvador
 * @namespace jointPanel
 * @memberof profiles
 * @since 0.12.5
 */

const jointPanelsInit = ({ jscad, swcadJs }) => {
    const {
        cube,
        cylinder,
        sphere,
        cylinderElliptic,
        circle,
        ellipse: ellipseShape,
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
        position,
    } = swcadJs.calcs

    const {
        connections,
    } = swcadJs.profiles


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @access private
     * @memberof profiles.jointPanel
     */
    const modelDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            constants: {
                sampleThickness: 1, // scission only works with 3D objects. Need a filler thickness for now
            },
            opts: {
                segments: 6,
                unitSegments: 24,
                numConnectors: 3,
            },
            dims: {
                size: [
                    math.inchesToMm(2.5),
                    math.inchesToMm(1.625),
                    math.inchesToMm(1),
                ],
                unitSpacing: math.inchesToMm(1),
                unitRadius: 6.35,
                radius: 12.7,
                interfaceMargin: math.inchesToMm(3 / 8),
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
            radius: defaultValues.dims.radius,
            unitSpacing: defaultValues.dims.unitSpacing,
            unitRadius: defaultValues.dims.unitRadius,
            segments: defaultValues.opts.segments,
            unitSegments: defaultValues.opts.unitSegments,
            numConnectors: defaultValues.opts.numConnectors,
            interfaceMargin: defaultValues.dims.interfaceMargin,
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
     * @access private
     * @memberof profiles.jointPanel
     */
    const modelOpts = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            size = defaults.opts.size,
            radius = defaults.opts.radius,
            unitSpacing = defaults.opts.unitSpacing,
            unitRadius = defaults.opts.unitRadius,
            unitSegments = defaults.opts.unitSegments,
            numConnectors = defaults.opts.numConnectors,
            segments = defaults.opts.segments,
            interfaceMargin = defaults.opts.interfaceMargin,
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
            ...stdOpts,
            size,
            radius,
            unitSpacing,
            unitRadius,
            segments,
            unitSegments,
            numConnectors,
            interfaceMargin,
        }


        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @access private
     * @memberof profiles.jointPanel
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()

        const {
            size,
            radius,
            unitSpacing,
            unitRadius,
            segments,
            unitSegments,
            numConnectors,
            interfaceMargin,
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

        const diametre = radius * 2
        const unitDiametre = unitRadius * 2

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
            segments,
            unitSegments,
            numConnectors,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            interfaceThickness,
            fitGap,
            width,
            depth,
            height,
            radius,
            unitSpacing,
            unitRadius,
            diametre,
            unitDiametre,
            interfaceMargin,
        }

        /** Various key points for model */
        const modelPoints = {
            centre: defaults.vals.points.centre,
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

    /**
     * Generate dovetail row connectors
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.jointPanel
     * @since 0.13.4
     */
    const dovetailRow = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            numConnectors
        } = modelProperties.opts

        const {
            width,
            depth,
            fitGap,
            interfaceMargin,
        } = modelProperties.dims

        const {
            sampleThickness
        } = modelProperties.constants

        ////////

        const numMargins = numConnectors + 1

        const totalConnectionWidths = width - (interfaceMargin * numMargins)
        const connectionWidth = totalConnectionWidths / numConnectors
        const connectionUnitWidth = 2 * interfaceMargin + connectionWidth

        const dovetailCutOpts = modelOpts({
            ...opts,
            size: [connectionUnitWidth, depth]
        })

        console.log('dovetailRow() width, depth', width, depth)
        console.log('dovetailRow() numConnectors, numMargins', numConnectors, numMargins)
        console.log('dovetailRow() connectionWidth, connectionUnitWidth', connectionWidth, connectionUnitWidth)
        console.log('dovetailRow() dovetailCutOpts', dovetailCutOpts)

        // For some very strange reason, tab and dovetail cuts get reversed?
        const dovetailCutData = connections.tab(dovetailCutOpts)
        const dovetailCutBase = dovetailCutData[1].cut

        console.log('dovetailRow() dovetailCutData', dovetailCutData)
        console.log('dovetailRow() dovetailCutBase', dovetailCutBase)

        let dovetailRowCut = dovetailCutBase

        const translateDistBase = interfaceMargin + connectionWidth
        for (let idx = 1; idx < numConnectors; idx++) {
            const translateDist = translateDistBase * idx
            dovetailRowCut = union(
                dovetailRowCut,
                translate([translateDist, 0, 0], dovetailCutBase)
            )
        }

        ////////

        const mainModel = [
            dovetailCutBase,
            dovetailRowCut,
        ]

        const modelParts = {
            male: dovetailRowCut,
            female: dovetailRowCut,
            cut: dovetailRowCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generate tab row connectors
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.jointPanel
     * @since 0.13.4
     */
    const tabRow = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            numConnectors
        } = modelProperties.opts

        const {
            width,
            depth,
            fitGap,
            interfaceMargin,
        } = modelProperties.dims

        const {
            sampleThickness
        } = modelProperties.constants

        ////////

        const numMargins = numConnectors + 1

        const totalConnectionWidths = width - (interfaceMargin * numMargins)
        const connectionWidth = totalConnectionWidths / numConnectors
        const connectionUnitWidth = 2 * interfaceMargin + connectionWidth

        const tabCutOpts = modelOpts({
            ...opts,
            size: [connectionUnitWidth, depth]
        })

        console.log('tabRow() width, depth', width, depth)
        console.log('tabRow() numConnectors, numMargins', numConnectors, numMargins)
        console.log('tabRow() connectionWidth, connectionUnitWidth', connectionWidth, connectionUnitWidth)
        console.log('tabRow() tabCutOpts', tabCutOpts)
        // console.log('tabRow() tabCutProps', tabCutProps)

        // For some very strange reason, tab and dovetail cuts get reversed?
        const tabCutData = connections.dovetail(tabCutOpts)
        const tabCutBase = tabCutData[1].cut
        console.log('tabRow() tabCutData', tabCutData)
        console.log('tabRow() tabCutBase', tabCutBase)

        let tabRowCut = tabCutBase

        const translateDistBase = interfaceMargin + connectionWidth
        for (let idx = 1; idx < numConnectors; idx++) {
            const translateDist = translateDistBase * idx
            tabRowCut = union(
                tabRowCut,
                translate([translateDist, 0, 0], tabCutBase)
            )
        }

        ////////

        const mainModel = [
            tabCutBase,
            tabRowCut,
        ]

        const modelParts = {
            male: tabRowCut,
            female: tabRowCut,
            cut: tabRowCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: modelDefaults,
        props: modelProps,
        dovetailRow,
        tabRow,
    }
}

module.exports = {
    init: jointPanelsInit
}
