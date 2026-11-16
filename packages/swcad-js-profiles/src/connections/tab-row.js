"use strict"

const connectionProfilesInit = ({ jscad, swcadJs }) => {
    const {
        cuboid,
    } = jscad.primitives

    const {
        translate,
    } = jscad.transforms

    const {
        subtract,
        union,
        scission
    } = jscad.booleans

    const {
        project
    } = jscad.extrusions

    const {
        math,
        position,
    } = swcadJs.calcs

    const {
        standards,
    } = swcadJs.data

    const {
        connections,
    } = swcadJs.profiles


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @access private
     * @memberof profiles.connections.tabRow
     */
    const modelDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            constants: {
                sampleThickness: 1, // scission only works with 3D objects. Need a filler thickness for now
            },
            opts: {
                segments: 6,
                numConnectors: 3,
            },
            dims: {
                size: [
                    math.inchesToMm(2.5),
                    math.inchesToMm(1.625),
                    math.inchesToMm(1),
                ],
                interfaceMargin: math.inchesToMm(3 / 8),
            },
            points: {
                centre: [0, 0, 0]
            }
        }

        const defaultOpts = {
            fitGap: standards.FIT_GAP,
            size: defaultValues.dims.size,
            segments: defaultValues.opts.segments,
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
     * @memberof profiles.connections.tabRow
     */
    const modelOpts = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            size = defaults.opts.size,
            numConnectors = defaults.opts.numConnectors,
            segments = defaults.opts.segments,
            interfaceMargin = defaults.opts.interfaceMargin,
            fitGap = defaults.opts.fitGap,
        } = opts
        
        const initOpts = {
            fitGap,
            size,
            segments,
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
     * @memberof profiles.connections.tabRow
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()

        const {
            size,
            segments,
            numConnectors,
            interfaceMargin,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const width = size[0]
        const depth = size[1]

        let interMargin = interfaceMargin
        if (typeof interfaceMargin == 'number') {
            interMargin = [interfaceMargin, interfaceMargin]
        }

        const midPoint = [
            width / 2,
            depth / 2,
        ]

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
            sampleThickness: defaults.vals.constants.sampleThickness,
        }

        /** Derived user options for the model */
        const modelOpts = {
            segments,
            numConnectors,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            fitGap,
            width,
            depth,
            interfaceMargin: interMargin,
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

    /**
     * Generates pieces connected by a row of dovetails.
     * @param {Object} opts - Options for the model
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number[]} opts.size
     * @param {number} opts.numConnectors
     * @param {number} opts.segments
     * @param {number} opts.interfaceMargin
     * @returns {Array.<(geom2|Object.<string, geom2>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof profiles.connections.tabRow
     */
    const dovetailRow = (opts) => {
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            numConnectors
        } = modelProperties.opts

        const {
            width,
            depth,
            interfaceMargin,
        } = modelProperties.dims

        const {
            centrePt
        } = modelProperties.points

        const {
            sampleThickness
        } = modelProperties.constants

        ////////

        const numMargins = numConnectors + 1

        const totalConnectionWidths = width - (interfaceMargin[0] * numMargins)
        const connectionWidth = totalConnectionWidths / numConnectors
        const connectionUnitWidth = 2 * interfaceMargin[0] + connectionWidth

        const dovetailCutOpts = modelOpts({
            ...opts,
            size: [connectionUnitWidth, depth]
        })

        const dovetailCutData = connections.tab.dovetail(dovetailCutOpts)
        const dovetailCutBase = dovetailCutData[1].cut

        const baseProfilePanel = cuboid({
            size: [width, depth, sampleThickness],
            center: [centrePt[0], centrePt[1], 0]
        })
        let dovetailRowCut = dovetailCutBase

        const translateDistBase = interfaceMargin[0] + connectionWidth
        for (let idx = 1; idx < numConnectors; idx++) {
            const translateDist = translateDistBase * idx
            dovetailRowCut = union(
                dovetailRowCut,
                translate([translateDist, 0, 0], dovetailCutBase)
            )
        }

        const cutPanel = subtract(
            baseProfilePanel,
            dovetailRowCut
        )
        const cutParts = scission(cutPanel)
        const dTailProfiles = [
            position.ctr(cutParts[1]),
            position.ctr(cutParts[0]),
        ]
        const dovetailProfiles = [
            project({}, dTailProfiles[0]),
            project({}, dTailProfiles[1]),
        ]

        ////////

        const mainModel = [
            dovetailProfiles[1],
            dovetailProfiles[0],
        ]

        const modelParts = {
            male: dovetailProfiles[1],
            female: dovetailProfiles[0],
            cut: dovetailRowCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates pieces connected by a row of tabs.
     * @param {Object} opts - Options for the model
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number[]} opts.size
     * @param {number} opts.numConnectors
     * @param {number} opts.segments
     * @param {number} opts.interfaceMargin
     * @returns {Array.<(geom2|Object.<string, geom2>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof profiles.connections.tabRow
     */
    const tabRow = (opts) => {
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            numConnectors
        } = modelProperties.opts

        const {
            width,
            depth,
            interfaceMargin,
        } = modelProperties.dims

        const {
            centrePt
        } = modelProperties.points

        const {
            sampleThickness
        } = modelProperties.constants

        ////////

        const numMargins = numConnectors + 1

        const totalConnectionWidths = width - (interfaceMargin[0] * numMargins)
        const connectionWidth = totalConnectionWidths / numConnectors
        const connectionUnitWidth = 2 * interfaceMargin[0] + connectionWidth

        const tabCutOpts = modelOpts({
            ...opts,
            size: [connectionUnitWidth, depth]
        })

        const tabCutData = connections.tab.tab(tabCutOpts)
        const tabCutBase = tabCutData[1].cut

        const baseProfilePanel = cuboid({
            size: [width, depth, sampleThickness],
            center: [centrePt[0], centrePt[1], 0]
        })
        let tabRowCut = tabCutBase

        const translateDistBase = interfaceMargin[0] + connectionWidth
        for (let idx = 1; idx < numConnectors; idx++) {
            const translateDist = translateDistBase * idx
            tabRowCut = union(
                tabRowCut,
                translate([translateDist, 0, 0], tabCutBase)
            )
        }

        const cutPanel = subtract(
            baseProfilePanel,
            tabRowCut
        )
        const cutParts = scission(cutPanel)
        const tProfiles = [
            position.ctr(cutParts[1]),
            position.ctr(cutParts[0]),
        ]
        const tabProfiles = [
            project({}, tProfiles[0]),
            project({}, tProfiles[1]),
        ]

        ////////

        const mainModel = [
            tabProfiles[1],
            tabProfiles[0],
        ]

        const modelParts = {
            male: tabProfiles[1],
            female: tabProfiles[0],
            cut: tabRowCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates pieces connected by a row of right-angle tabs.
     * @param {Object} opts - Options for the model
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number[]} opts.size
     * @param {number} opts.numConnectors
     * @param {number} opts.segments
     * @param {number} opts.interfaceMargin
     * @returns {Array.<(geom2|Object.<string, geom2>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof profiles.connections.tabRow
     */
    const rightAngleTabRow = (opts) => {
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            numConnectors
        } = modelProperties.opts

        const {
            width,
            depth,
            interfaceMargin,
        } = modelProperties.dims

        const {
            centrePt
        } = modelProperties.points

        const {
            sampleThickness
        } = modelProperties.constants

        ////////

        const numMargins = numConnectors + 1

        const totalConnectionWidths = width - (interfaceMargin[0] * numMargins)
        const connectionWidth = totalConnectionWidths / numConnectors
        const connectionUnitWidth = 2 * interfaceMargin[0] + connectionWidth

        const rAngTabCutOpts = modelOpts({
            ...opts,
            size: [connectionUnitWidth, depth]
        })

        const rAngTabCutData = connections.tab.rightAngleTab(rAngTabCutOpts)
        const rAngTabCutBase = rAngTabCutData[1].cut

        const baseProfilePanel = cuboid({
            size: [width, depth, sampleThickness],
            center: [centrePt[0], centrePt[1], 0]
        })
        let rAngTabRowCut = rAngTabCutBase

        const translateDistBase = interfaceMargin[0] + connectionWidth
        for (let idx = 1; idx < numConnectors; idx++) {
            const translateDist = translateDistBase * idx
            rAngTabRowCut = union(
                rAngTabRowCut,
                translate([translateDist, 0, 0], rAngTabCutBase)
            )
        }

        const cutPanel = subtract(
            baseProfilePanel,
            rAngTabRowCut
        )
        const cutParts = scission(cutPanel)
        const rtProfiles = [
            position.ctr(cutParts[1]),
            position.ctr(cutParts[0]),
        ]
        const rAngTabProfiles = [
            project({}, rtProfiles[0]),
            project({}, rtProfiles[1]),
        ]

        ////////

        const mainModel = [
            rAngTabProfiles[1],
            rAngTabProfiles[0],
        ]

        const modelParts = {
            male: rAngTabProfiles[1],
            female: rAngTabProfiles[0],
            cut: rAngTabRowCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Modelling functions that generate various connecting tab rows.
     * @author R. J. Salvador
     * @namespace tabRow
     * @memberof profiles.connections
     */
    return {
        defaults: modelDefaults,
        props: modelProps,
        dovetailRow,
        tabRow,
        rightAngleTabRow,
    }
}

module.exports = {
    init: connectionProfilesInit
}
