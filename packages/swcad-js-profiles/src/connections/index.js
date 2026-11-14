"use strict"

const tabModule = require('./tab')

/**
 * Modelling functions that generate connecting and interlocking 2D parts.
 * @author R. J. Salvador
 * @namespace connections
 * @memberof profiles
 */

const connectionProfilesInit = ({ jscad, swcadJs }) => {
    const {
        circle,
    } = jscad.primitives

    const {
        translate,
    } = jscad.transforms

    const {
        subtract,
        union,
    } = jscad.booleans

    const {
        hull,
    } = jscad.hulls

    const { toOutlines } = jscad.geometries.geom2

    const {
        math,
    } = swcadJs.calcs

    const {
        standards,
    } = swcadJs.data


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @access private
     * @memberof profiles.connections
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
            },
            dims: {
                unitSpacing: math.inchesToMm(1),
                unitRadius: 6.35,
                radius: 12.7,
                interfaceMargin: math.inchesToMm(3 / 8),
            },
            points: {}
        }

        const defaultOpts = {
            fitGap: standards.FIT_GAP,
            radius: defaultValues.dims.radius,
            unitSpacing: defaultValues.dims.unitSpacing,
            unitRadius: defaultValues.dims.unitRadius,
            segments: defaultValues.opts.segments,
            unitSegments: defaultValues.opts.unitSegments,
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
     * @memberof profiles.connections
     */
    const modelOpts = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            radius = defaults.opts.radius,
            unitSpacing = defaults.opts.unitSpacing,
            unitRadius = defaults.opts.unitRadius,
            unitSegments = defaults.opts.unitSegments,
            segments = defaults.opts.segments,
            interfaceMargin = defaults.opts.interfaceMargin,
            fitGap = defaults.opts.fitGap,
        } = opts


        const initOpts = {
            fitGap,
            radius,
            unitSpacing,
            unitRadius,
            segments,
            unitSegments,
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
     * @memberof profiles.connections
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()

        const {
            radius,
            unitSpacing,
            unitRadius,
            segments,
            unitSegments,
            interfaceMargin,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */


        const diametre = radius * 2
        const unitDiametre = unitRadius * 2
        let interMargin = interfaceMargin
        if (typeof interfaceMargin == 'number') {
            interMargin = [interfaceMargin, interfaceMargin]
        }

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
            unitSegments,
        }

        /** Various dimensions for model */
        const modelDims = {
            fitGap,
            radius,
            unitSpacing,
            unitRadius,
            diametre,
            unitDiametre,
            interfaceMargin: interMargin,
        }

        /** Various key points for model */
        const modelPoints = defaults.vals.points

        /** Components used by model */
        const modelComponents = defaults.vals.constants

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
     * Generates polygon connectors.
     * @param {Object} opts - Options for the model
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.radius
     * @param {number} opts.unitSpacing
     * @param {number} opts.unitRadius
     * @param {number} opts.unitSegments
     * @param {number} opts.segments
     * @param {number} opts.interfaceMargin
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
     */
    const polygon = (opts) => {
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            segments,
        } = modelProperties.opts

        const {
            radius,
            fitGap,
            diametre,
            interfaceMargin,
        } = modelProperties.dims

        const halfGap = fitGap / 2
        const cornerRadius = math.inchesToMm(1 / 4)

        const specs = {
            dowelRadius: -halfGap + radius,
            holeRadius: halfGap + radius,
        }

        specs.totalWidth = interfaceMargin[0] * 2 + diametre
        const halfWidth = specs.totalWidth / 2
        specs.cornerPoints = [
            [halfWidth - cornerRadius, halfWidth - cornerRadius, 0],
            [-halfWidth + cornerRadius, halfWidth - cornerRadius, 0],
            [-halfWidth + cornerRadius, -halfWidth + cornerRadius, 0],
            [halfWidth - cornerRadius, -halfWidth + cornerRadius, 0],
        ]

        const dowel = circle({ radius: specs.dowelRadius, segments })
        const dowelDie = circle({ radius: specs.holeRadius, segments })

        const corners = specs.cornerPoints.map(cPt => {
            return translate(cPt, circle({ radius: cornerRadius }))
        })
        const basePlate = hull(corners)

        const male = dowel
        const female = subtract(basePlate, dowelDie)

        const polygonProfiles = [
            female,
            male,
        ]

        const mainModel = [
            polygonProfiles[1],
            polygonProfiles[0],
        ]

        const modelParts = {
            male: polygonProfiles[1],
            female: polygonProfiles[0],
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates pegboard connectors.
     * @param {Object} opts - Options for the model
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.radius
     * @param {number} opts.unitSpacing
     * @param {number} opts.unitRadius
     * @param {number} opts.unitSegments
     * @param {number} opts.segments
     * @param {number} opts.interfaceMargin
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
     */
    const pegboard = (opts) => {
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            unitSegments,
        } = modelProperties.opts

        const {
            unitRadius,
            unitSpacing,
            fitGap,
            unitDiametre,
            interfaceMargin,
        } = modelProperties.dims

        const halfGap = fitGap / 2
        const cornerRadius = unitDiametre * 0.75

        const specs = {
            dowelRadius: -halfGap + unitRadius,
            holeRadius: halfGap + unitRadius,
        }

        specs.totalWidth = interfaceMargin[0] * 2 + (unitRadius * 2 + unitSpacing)
        const halfWidth = specs.totalWidth / 2
        specs.cornerPoints = [
            [halfWidth - cornerRadius, halfWidth - cornerRadius, 0],
            [-halfWidth + cornerRadius, halfWidth - cornerRadius, 0],
            [-halfWidth + cornerRadius, -halfWidth + cornerRadius, 0],
            [halfWidth - cornerRadius, -halfWidth + cornerRadius, 0],
        ]
        const halfUnit = unitSpacing / 2
        specs.dowelPoints = [
            [halfUnit, halfUnit, 0],
            [-halfUnit, halfUnit, 0],
            [-halfUnit, -halfUnit, 0],
            [halfUnit, -halfUnit, 0],
        ]

        const corners = specs.cornerPoints.map(cPt => {
            return translate(cPt, circle({ radius: cornerRadius }))
        })
        const dowels = specs.dowelPoints.map(dPt => {
            return translate(dPt, circle({ radius: specs.dowelRadius, segments: unitSegments }))
        })
        const dowelDies = specs.dowelPoints.map(dPt => {
            return translate(dPt, circle({ radius: specs.holeRadius, segments: unitSegments }))
        })

        const basePlate = hull(corners)
        const dowelAssembly = union(dowels)

        const male = dowelAssembly
        const female = subtract(basePlate, dowelDies)

        const pegboardProfiles = [
            female,
            male,
        ]

        const mainModel = [
            pegboardProfiles[1],
            pegboardProfiles[0],
        ]

        const modelParts = {
            male: pegboardProfiles[1],
            female: pegboardProfiles[0],
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates bolt circle connectors.
     * @param {Object} opts - Options for the model
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.radius
     * @param {number} opts.unitSpacing
     * @param {number} opts.unitRadius
     * @param {number} opts.unitSegments
     * @param {number} opts.segments
     * @param {number} opts.interfaceMargin
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
     */
    const boltCircle = (opts) => {
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            segments,
            unitSegments,
        } = modelProperties.opts

        const {
            radius,
            unitRadius,
            fitGap,
            interfaceMargin,
        } = modelProperties.dims

        const halfGap = fitGap / 2
        const holeRadius = unitRadius + halfGap
        const inCircle = circle({ radius, segments })
        const holePoints = toOutlines(inCircle)[0]

        const dowels = holePoints.map(dPt => {
            return translate(dPt, circle({ radius: unitRadius, segments: unitSegments }))
        })
        const dowelDies = holePoints.map(dPt => {
            return translate(dPt, circle({ radius: holeRadius, segments: unitSegments }))
        })

        const basePlateRadius = radius + unitRadius + interfaceMargin[0]
        const basePlate = circle({ radius: basePlateRadius })
        const dowelAssembly = union(dowels)

        const male = dowelAssembly
        const female = subtract(basePlate, dowelDies)

        const pegboardProfiles = [
            female,
            male,
        ]

        const mainModel = [
            pegboardProfiles[1],
            pegboardProfiles[0],
        ]

        const modelParts = {
            male: pegboardProfiles[1],
            female: pegboardProfiles[0],
        }

        return [mainModel, modelParts, modelProperties]
    }

    const tab = tabModule.init({ jscad, swcadJs })

    return {
        defaults: modelDefaults,
        props: modelProps,
        tab,
        polygon,
        pegboard,
        boltCircle,
    }
}

module.exports = {
    init: connectionProfilesInit
}
