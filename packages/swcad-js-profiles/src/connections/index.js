"use strict"

/**
 * Connection Profiles
 * @author R. J. Salvador
 * @namespace connections
 * @memberof profiles
 * @since 0.12.5
 */

const connectionProfilesInit = ({ jscad, swcadJs }) => {
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
     * @memberof profiles.connections
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
     * @memberof profiles.connections
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

        const diametre = radius * 2
        const unitDiametre = unitRadius * 2

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
            radius,
            unitSpacing,
            unitRadius,
            diametre,
            unitDiametre,
            interfaceMargin,
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

    /**
     * old function for dovetail/tab connections
     * @param {*} param0
     * @access private
     * @returns ...
     * @deprecated
     */
    const connectionTrapezoid = ({ depth, width, angle, reverse = false }) => {
        const baseRect = rectangle({ size: [depth, width] })
        const baseRectCoords = position.getGeomCoords(baseRect)
        const triOpts = position.triangle.rightTriangleOpts({ long: depth, longAngle: angle })
        const triangleEnds = [
            align(
                { modes: ['center', 'max', 'center'], relativeTo: [0, baseRectCoords.back, 0] },
                mirror({ normal: [0, 1, 0] }, triangle(triOpts))
            ),
            align(
                { modes: ['center', 'min', 'center'], relativeTo: [0, baseRectCoords.front, 0] },
                triangle(triOpts)
            ),
        ]

        const outShape = subtract(baseRect, triangleEnds)

        if (reverse) {
            return mirror({ normal: [1, 0, 0] }, outShape)
        }
        return outShape
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * Generate dovetail connectors
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
     * @since 0.12.5
     */
    const dovetail = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            width,
            depth,
            fitGap,
            interfaceMargin,
        } = modelProperties.dims

        const {
            centrePt
        } = modelProperties.points

        const {
            sampleThickness
        } = modelProperties.constants

        const dovetailWidth = width - (interfaceMargin * 2)
        const dovetailLength = depth - (interfaceMargin * 2)

        const dovetailEndSize = [
            dovetailLength / 6,
            dovetailLength,
        ]

        const widthCoords = [
            interfaceMargin,
            interfaceMargin + dovetailWidth,
        ]
        const lengthCoords = [
            interfaceMargin,
            interfaceMargin + dovetailLength,
        ]

        const baseProfilePanel = cuboid({
            size: [width, depth, sampleThickness],
            center: [centrePt[0], centrePt[1], 0]
        })

        const lowerPts = [
            [0, lengthCoords[0]],
            [widthCoords[0] + dovetailEndSize[0], lengthCoords[0]],
            [widthCoords[1] - dovetailEndSize[0], lengthCoords[0]],
            [width, lengthCoords[0]],
        ]

        const upperPts = [
            [widthCoords[0], lengthCoords[1]],
            [widthCoords[1], lengthCoords[1]],
        ]

        const allPts = [
            lowerPts[0],
            lowerPts[1],
            ...upperPts,
            lowerPts[2],
            lowerPts[3],
        ]

        let dovetailCutPoints = allPts.map(dtPt => {
            return cylinder({
                radius: fitGap / 2,
                height: sampleThickness * 10,
                center: [dtPt[0], dtPt[1], 0],
            })
        })

        const dovetailCut = hullChain(dovetailCutPoints)

        const cutPanel = subtract(
            baseProfilePanel,
            dovetailCut
        )

        const cutParts = scission(cutPanel)
        const dTailProfiles = [
            align({ modes: ['center', 'center', 'center'] }, cutParts[1]),
            align({ modes: ['center', 'center', 'center'] }, cutParts[0]),
        ]

        const dovetailProfiles = [
            project({}, dTailProfiles[0]),
            project({}, dTailProfiles[1]),
        ]

        const mainModel = [
            dovetailProfiles[1],
            dovetailProfiles[0],
        ]

        const modelParts = {
            male: dovetailProfiles[1],
            female: dovetailProfiles[0],
            cut: dovetailCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generate tab connectors
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
     * @since 0.12.5
     */
    const tab = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            width,
            depth,
            fitGap,
            interfaceMargin,
        } = modelProperties.dims

        const {
            sampleThickness
        } = modelProperties.constants

        const {
            centrePt
        } = modelProperties.points

        const tabWidth = width - (interfaceMargin * 2)
        const tabLength = depth - (interfaceMargin * 2)

        const tabEndSize = [
            tabLength / 6,
            tabLength,
        ]

        const widthCoords = [
            interfaceMargin,
            interfaceMargin + tabWidth,
        ]
        const lengthCoords = [
            interfaceMargin,
            interfaceMargin + tabLength,
        ]

        const baseProfilePanel = cuboid({
            size: [width, depth, sampleThickness],
            center: [centrePt[0], centrePt[1], 0]
        })

        const lowerPts = [
            [0, lengthCoords[0]],
            [widthCoords[0], lengthCoords[0]],
            [widthCoords[1], lengthCoords[0]],
            [width, lengthCoords[0]],
        ]

        const upperPts = [
            [widthCoords[0] + tabEndSize[0], lengthCoords[1]],
            [widthCoords[1] - tabEndSize[0], lengthCoords[1]],
        ]

        const allPts = [
            lowerPts[0],
            lowerPts[1],
            ...upperPts,
            lowerPts[2],
            lowerPts[3],
        ]

        let tabCutPoints = allPts.map(dtPt => {
            return cylinder({
                radius: fitGap / 2,
                height: sampleThickness * 10,
                center: [dtPt[0], dtPt[1], 0],
            })
        })

        const tabCut = hullChain(tabCutPoints)

        const cutPanel = subtract(
            baseProfilePanel,
            tabCut
        )

        const cutParts = scission(cutPanel)
        const dTailProfiles = [
            align({ modes: ['center', 'center', 'center'] }, cutParts[1]),
            align({ modes: ['center', 'center', 'center'] }, cutParts[0]),
        ]

        const tabProfiles = [
            project({}, dTailProfiles[0]),
            project({}, dTailProfiles[1]),
        ]

        const mainModel = [
            tabProfiles[1],
            tabProfiles[0],
        ]

        const modelParts = {
            male: tabProfiles[1],
            female: tabProfiles[0],
            cut: tabCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generate polygon connectors
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
     * @since 0.12.5
     */
    const polygon = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            segments,
        } = modelProperties.opts

        const {
            width,
            depth,
            radius,
            fitGap,
            diametre,
            interfaceMargin,
        } = modelProperties.dims

        const {
            sampleThickness
        } = modelProperties.constants

        const halfGap = fitGap / 2
        const cornerRadius = math.inchesToMm(1 / 4)

        const specs = {
            dowelRadius: -halfGap + radius,
            holeRadius: halfGap + radius,
        }

        specs.totalWidth = interfaceMargin * 2 + diametre
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
     * Generate ellipse connectors
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
     * @since 0.12.6
     */
    const ellipse = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            segments,
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

        const halfGap = fitGap / 2
        const cornerRadius = math.inchesToMm(1 / 4)

        const diam = [
            width - (interfaceMargin * 2),
            (depth - (interfaceMargin * 2)) * 2,
        ]
        const radius = [
            diam[0] / 2,
            diam[1] / 2,
        ]
        const holeRadius = [
            radius[0] + (fitGap / 2),
            radius[1] + (fitGap / 2),
        ]

        const dowelCtr = [0, depth / -2 + interfaceMargin, 0]
        const dowel = ellipseShape({ radius, segments, center: dowelCtr })
        const dowelDie = ellipseShape({ radius: holeRadius, segments, center: dowelCtr })

        const mPlate = rectangle({
            size: [
                width,
                interfaceMargin,
                0,
            ]
        })
        let malePlate = align({
            modes: ['center', 'min', 'center'],
            relativeTo: [0, depth / -2, 0],
        }, mPlate)

        let cutDowel = subtract(
            align({
                modes: ['center', 'center', 'center'],
            }, dowel),
            align({
                modes: ['center', 'max', 'center'],
            }, rectangle({ size: [holeRadius[0] * 2, holeRadius[1] * 2] }))
        )
        cutDowel = align({
            modes: ['center', 'min', 'center'],
            relativeTo: dowelCtr,
        }, cutDowel)

        const fPlate = rectangle({
            size: [
                width,
                depth - interfaceMargin - fitGap,
                0,
            ]
        })
        let femalePlate = align({
            modes: ['center', 'max', 'center'],
            relativeTo: [0, depth / 2, 0],
        }, fPlate)

        const male = union(cutDowel, malePlate)

        const female = subtract(femalePlate, dowelDie)

        const ellipseProfiles = [
            female,
            male,
        ]

        const mainModel = [
            ellipseProfiles[1],
            ellipseProfiles[0],
        ]

        const modelParts = {
            male: ellipseProfiles[1],
            female: ellipseProfiles[0],
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generate pegboard connectors
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
     * @since 0.12.5
     */
    const pegboard = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            unitSegments,
        } = modelProperties.opts

        const {
            width,
            depth,
            unitRadius,
            unitSpacing,
            fitGap,
            unitDiametre,
            interfaceMargin,
        } = modelProperties.dims

        const {
            sampleThickness
        } = modelProperties.constants

        const halfGap = fitGap / 2
        const cornerRadius = unitDiametre * 0.75

        const specs = {
            dowelRadius: -halfGap + unitRadius,
            holeRadius: halfGap + unitRadius,
        }

        specs.totalWidth = interfaceMargin * 2 + (unitRadius * 2 + unitSpacing)
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
     * Generate bolt circle connectors
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
     * @since 0.12.6
     */
    const boltCircle = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            segments,
            unitSegments,
        } = modelProperties.opts

        const {
            radius,
            diametre,
            unitRadius,
            unitSpacing,
            fitGap,
            unitDiametre,
            interfaceMargin,
        } = modelProperties.dims

        const {
            sampleThickness
        } = modelProperties.constants

        const halfGap = fitGap / 2
        const holeRadius = unitRadius + halfGap
        const inCircle = circle({ radius, segments })
        const holePoints = toOutlines(inCircle)[0]
        const basePunch = circle({ radius: unitRadius })

        const dowels = holePoints.map(dPt => {
            return translate(dPt, circle({ radius: unitRadius, segments: unitSegments }))
        })
        const dowelDies = holePoints.map(dPt => {
            return translate(dPt, circle({ radius: holeRadius, segments: unitSegments }))
        })

        const basePlateRadius = radius + unitRadius + interfaceMargin
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

    /**
     * Generate dovetail row connectors
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
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
            centrePt
        } = modelProperties.points

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

        // For some very strange reason, tab and dovetail cuts get reversed?
        const dovetailCutData = tab(dovetailCutOpts)
        const dovetailCutBase = dovetailCutData[1].cut

        const baseProfilePanel = cuboid({
            size: [width, depth, sampleThickness],
            center: [centrePt[0], centrePt[1], 0]
        })
        let dovetailRowCut = dovetailCutBase

        const translateDistBase = interfaceMargin + connectionWidth
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
            align({ modes: ['center', 'center', 'center'] }, cutParts[1]),
            align({ modes: ['center', 'center', 'center'] }, cutParts[0]),
        ]
        const dovetailProfiles = [
            project({}, dTailProfiles[0]),
            project({}, dTailProfiles[1]),
        ]

        ////////

        const mainModel = [
            dovetailProfiles[0],
            dovetailProfiles[1],
        ]

        const modelParts = {
            male: dovetailProfiles[0],
            female: dovetailProfiles[1],
            cut: dovetailRowCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generate tab row connectors
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof profiles.connections
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
            centrePt
        } = modelProperties.points

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

        // For some very strange reason, tab and dovetail cuts get reversed?
        const tabCutData = dovetail(tabCutOpts)
        const tabCutBase = tabCutData[1].cut

        const baseProfilePanel = cuboid({
            size: [width, depth, sampleThickness],
            center: [centrePt[0], centrePt[1], 0]
        })
        let tabRowCut = tabCutBase

        const translateDistBase = interfaceMargin + connectionWidth
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
            align({ modes: ['center', 'center', 'center'] }, cutParts[1]),
            align({ modes: ['center', 'center', 'center'] }, cutParts[0]),
        ]
        const tabProfiles = [
            project({}, tProfiles[0]),
            project({}, tProfiles[1]),
        ]

        ////////

        const mainModel = [
            tabProfiles[0],
            tabProfiles[1],
        ]

        const modelParts = {
            male: tabProfiles[0],
            female: tabProfiles[1],
            cut: tabRowCut,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: modelDefaults,
        props: modelProps,
        dovetail,
        tab,
        polygon,
        ellipse,
        pegboard,
        boltCircle,
        dovetailRow,
        tabRow,
    }
}

module.exports = {
    init: connectionProfilesInit
}
