/**
 * Component for generating an open web joist, with various options for dimensions and reinforcement levels.
 * @namespace openWebJoist
 * @memberof components
 * @author R. J. Salvador (Salvador Workshop)
 */

"use strict"

const openWebJoistInit = ({ jscad, swcadJs }) => {
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
        position,
    } = swcadJs.utils

    const beadsBits = require('../beads-bits').init({ jscad, swcadJs });

    const {
        interfaceProfileBeads
    } = beadsBits

    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof openWebJoist
     */
    const modelDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            dims: {
                size: [
                    math.inchesToMm(2),
                    math.inchesToMm(4),
                    math.inchesToMm(1),
                ],
            },
            points: {
                centre: [0, 0, 0]
            },
            typeDetails: {
                default: { id: 'default', desc: 'Default' },
                alt: { id: 'alt', desc: 'Alternate' },
            },
            width: math.inchesToMm(1.125),
            length: math.inchesToMm(5.5),
            type: 'default',
            reinforcementLevel: 1,
            unitLength: math.inchesToMm(1),
            dowelHolderLength: math.inchesToMm(5 / 16),
            interfaceThickness: 1.333,
            fitGap: math.inchesToMm(1 / 128),
            ratioDiamToHolderHeight: 1.666667,
            ratioDiamToChannelDepth: 0.866667,
            ratioDiamToSideChannelWidth: 1,
            ratioDiamToDowelDepth: 0.333333,
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            type: 'default',
            scale: 1,
            interfaceThickness: 1.333333,
            fitGap: math.inchesToMm(1 / 128),
            logMode: 'normal',
            width: defaultValues.width,
            length: defaultValues.length,
            reinforcementLevel: defaultValues.reinforcementLevel,
            unitLength: defaultValues.unitLength,
            dowelHolderLength: defaultValues.dowelHolderLength,
        }

        return {
            opts: defaultOpts,
            vals: defaultValues,
        }
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof openWebJoist
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()
        console.log('openWebJoist.modelProps() -- opts', opts)

        const {
            type,
            scale,
            interfaceThickness,
            fitGap,
            logMode,
            width,
            length,
            reinforcementLevel,
            unitLength,
            dowelHolderLength,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const lgProfileBeadWidth = interfaceThickness * 1.75
        const mdProfileBeadWidth = interfaceThickness * 1.5
        const smProfileBeadWidth = interfaceThickness * 1.125

        const lengthUnits = Math.ceil(length / unitLength)

        const edgeWidth = lgProfileBeadWidth
        const supportWidth = mdProfileBeadWidth
        const lightSupportWidth = smProfileBeadWidth


        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
            ratioDiamToHolderHeight: defaults.vals.ratioDiamToHolderHeight,
            ratioDiamToChannelDepth: defaults.vals.ratioDiamToChannelDepth,
            ratioDiamToSideChannelWidth: defaults.vals.ratioDiamToSideChannelWidth,
            ratioDiamToDowelDepth: defaults.vals.ratioDiamToDowelDepth,
        }

        /** Derived user options for the model */
        const modelOpts = {
            type,
            scale,
            reinforcementLevel,
        }

        /** Various dimensions for model */
        const modelDims = {
            width,
            length,
            unitLength,
            lengthUnits,
            dowelHolderLength,
            interfaceThickness,
            fitGap,
            edgeWidth,
            supportWidth,
            lightSupportWidth,
        }

        /** Various key points for model */
        const modelPoints = {
            centre: defaults.vals.points.centre,
        }

        /** Components used by model */
        const modelComponents = {
            interfaceProfileBeads: interfaceProfileBeads(
                interfaceThickness,
                smProfileBeadWidth,
                mdProfileBeadWidth,
                lgProfileBeadWidth,
            ),
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

        console.log('openWebJoist.modelProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------


    /**
     * Open Web Joist component`
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @param {Object} opts - Options for the model
      * @param {string} opts.type - Type of the model, for future use with different design variations
      * @param {number} opts.scale - Scale factor for the model
      * @param {number} opts.interfaceThickness - Thickness of the interface connections
      * @param {number} opts.fitGap - Gap for fitting parts together
      * @param {string} opts.logMode - Logging mode for debugging (e.g., 'verbose', 'normal', 'error')
      * @param {number} opts.width - Width of the joist
      * @param {number} opts.length - Length of the joist
      * @param {number} opts.reinforcementLevel - Level of reinforcement (1: basic, 2: moderate, 3: high)
      * @param {number} opts.unitLength - Length of each unit section for webbing
      * @param {number} opts.dowelHolderLength - Length of the dowel holder sections
     * @instance
     * @memberof components.openWebJoist
     */
    const model = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            type = defaults.opts.type,
            scale = defaults.opts.scale,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
            logMode = defaults.opts.logMode,
            width = defaults.opts.width,
            length = defaults.opts.length,
            // // dowelRadius = defaults.opts.dowelRadius,
            // // dovetailOpt = defaults.opts.dovetailOpt,
            reinforcementLevel = defaults.opts.reinforcementLevel,
            unitLength = defaults.opts.unitLength,
            dowelHolderLength = defaults.opts.dowelHolderLength,
        } = opts

        const inOpts = {
            type,
            scale,
            interfaceThickness,
            fitGap,
            logMode,
            width,
            length,
            // dovetailOpt,
            reinforcementLevel,
            unitLength,
            dowelHolderLength,
        }

        console.log('openWebJoist.model() -- opts', opts)
        console.log('openWebJoist.model() -- inOpts', inOpts)

        const modelProperties = modelProps(inOpts)

        /* ----------------------------------------
         * Modelling, Component/Assembly Modules
         * ------------------------------------- */


        const framePanelWebs = (modelProps) => {
            const {
                reinforcementLevel
            } = modelProps.opts

            const {
                size,
                lengthUnits,
                unitLength,
                length,
                interfaceThickness,
                fitGap,
                width,
                edgeWidth,
                supportWidth,
                lightSupportWidth,
            } = modelProps.dims

            const {
                interfaceProfileBeads
            } = modelProps.components

            const panelPtsWidth = width - edgeWidth

            const braceUnitSize = [
                panelPtsWidth,
                unitLength
            ]
            const braceUnitMidpoint = [
                braceUnitSize[0] / 2,
                braceUnitSize[1] / 2,
            ]
            const braceUnitCentrePoints = []
            for (let idx = 0; idx < lengthUnits; idx++) {
                braceUnitCentrePoints.push([
                    braceUnitMidpoint[0],
                    unitLength * idx + braceUnitMidpoint[1],
                    0,
                ])
            }
            let braceUnitPts = [
                [0, 0, 0],
                [braceUnitSize[0], braceUnitSize[1], 0],
                [braceUnitSize[0], 0, 0],
                [0, braceUnitSize[1], 0],
            ]

            const supportPts = braceUnitPts.map(buPt => {
                return translate(buPt, interfaceProfileBeads.md)
            })
            const supportLine1 = hull(supportPts[0], supportPts[1])
            const supportLine2 = hull(supportPts[2], supportPts[3])
            let diagonalSupports = supportLine1
            if (reinforcementLevel > 1) {
                diagonalSupports = union(supportLine1, supportLine2)
            }

            const lightSupportPts = [
                [0, 0, 0],
                [braceUnitSize[0], 0, 0],
                [0, braceUnitSize[1], 0],
                [braceUnitSize[0], braceUnitSize[1], 0],
                [0, braceUnitMidpoint[1], 0],
                [braceUnitSize[0], braceUnitMidpoint[1], 0],
            ]
            let lightSupportProfilePts = lightSupportPts.map(lsPts => {
                return translate(lsPts, interfaceProfileBeads.sm)
            })
            const lightSupportLine1 = hull(lightSupportProfilePts[0], lightSupportProfilePts[1])
            const lightSupportLine2 = hull(lightSupportProfilePts[2], lightSupportProfilePts[3])
            const lightSupportLine3 = hull(lightSupportProfilePts[4], lightSupportProfilePts[5])
            let lightSupports = union(
                lightSupportLine1,
                lightSupportLine2,
            )
            if (reinforcementLevel > 2) {

                lightSupports = union(
                    lightSupports,
                    lightSupportLine3,
                )
            }

            const braceUnit = union(
                diagonalSupports,
                lightSupports,
            )
            let braceUnits = braceUnitCentrePoints.map(bucPt => {
                return align({ modes: ['center', 'center', 'center'], relativeTo: bucPt }, braceUnit)
            })
            braceUnits = union(...braceUnits)

            const edgePts = [
                [0, 0, 0],
                [0, length, 0],
                [braceUnitSize[0], 0, 0],
                [braceUnitSize[0], length, 0],
            ]
            const edgeProfilePts = edgePts.map(edgePt => {
                return align({
                    modes: ['center', 'center', 'center'],
                    relativeTo: edgePt
                }, interfaceProfileBeads.lg)
            })

            const edge1 = hull(edgeProfilePts[0], edgeProfilePts[1])
            const edge2 = hull(edgeProfilePts[2], edgeProfilePts[3])

            const joistEdges = union(
                edge1,
                edge2,
            )

            let endCap = cuboid({ size: [width, edgeWidth, interfaceThickness] })
            endCap = align({
                modes: ['min', 'min', 'center'],
                relativeTo: [edgeWidth / -2, 0, 0]
            }, endCap)
            const endCaps = union(
                endCap,
                translate([0, length - edgeWidth, 0], endCap)
            )

            const joistWebs = union(
                position.ctr(joistEdges),
                position.ctr(braceUnits),
                position.ctr(endCaps),
            )

            const keepArea = cuboid({
                size: [
                    width,
                    length,
                    interfaceThickness * 2,
                ]
            })

            return intersect(joistWebs, keepArea)
        }



        /* ----------------------------------------
         * Complete Assembly
         * ------------------------------------- */

        /** Final Assembly */
        const finalAssembly = (modelProps) => {
            fPanelWebs = framePanelWebs(modelProps)

            return fPanelWebs
        }

        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */

        let fPanelWebs = framePanelWebs(modelProperties)

        let mainModel = finalAssembly(modelProperties)

        let modelParts = {
            framePanelWebs: fPanelWebs,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return model
}

module.exports = {
    init: openWebJoistInit,
}
