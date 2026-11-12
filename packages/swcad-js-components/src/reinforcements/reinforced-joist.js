"use strict"

const reinforcedJoistInit = ({ jscad, swcadJs }) => {
    const {
        cuboid,
    } = jscad.primitives

    const {
        align,
        translate,
    } = jscad.transforms

    const {
        intersect,
        union,
    } = jscad.booleans

    const {
        hull,
    } = jscad.hulls

    const {
        math,
        position,
    } = swcadJs.calcs

    const {
        standards,
    } = swcadJs.data

    const {
        beadsBits
    } = swcadJs.components

    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.reinforcements
     * @access private
     */
    const reinforcedJoistDefaults = () => {
        const interfaceThickness = standards.INTERFACE_THICKNESS

        const defaultValues = {
            constants: {
                interfaceThickness,
                ratioDiamToHolderHeight: 1.666667,
                ratioDiamToChannelDepth: 0.866667,
                ratioDiamToSideChannelWidth: 1,
                ratioDiamToDowelDepth: 0.333333,
            },
            opts: {
                reinforcementLevel: 1,
            },
            dims: {
                width: math.inchesToMm(1.125),
                length: math.inchesToMm(5.5),
                unitLength: math.inchesToMm(1),
                interfaceThickness: standards.INTERFACE_THICKNESS,
            },
            points: {},
            components: {},
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            width: defaultValues.dims.width,
            length: defaultValues.dims.length,
            unitLength: defaultValues.dims.unitLength,
            interfaceThickness: defaultValues.dims.interfaceThickness,
            reinforcementLevel: defaultValues.opts.reinforcementLevel,
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
     * @memberof components.reinforcements
     * @access private
     */
    const reinforcedJoistProps = (opts) => {
        const defaults = reinforcedJoistDefaults()

        const {
            interfaceThickness,
            width,
            length,
            reinforcementLevel,
            unitLength,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const lgProfileBeadWidth = standards.LG_PROFILE_BEAD_WIDTH
        const mdProfileBeadWidth = standards.MD_PROFILE_BEAD_WIDTH
        const smProfileBeadWidth = standards.SM_PROFILE_BEAD_WIDTH

        const lengthUnits = Math.ceil(length / unitLength)

        const edgeWidth = lgProfileBeadWidth
        const supportWidth = mdProfileBeadWidth
        const lightSupportWidth = smProfileBeadWidth


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
            length,
            unitLength,
            lengthUnits,
            interfaceThickness,
            edgeWidth,
            supportWidth,
            lightSupportWidth,
        }

        /** Various key points for model */
        const modelPoints = defaults.vals.points

        /** Components used by model */
        const modelComponents = {
            interfaceProfileBeads: beadsBits.interface30DegProfileBeads(
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
            constants: modelConstants,
            opts: modelOpts,
            dims: modelDims,
            points: modelPoints,
            components: modelComponents,
        }


        return modelProperties
    }


    //------------------------------------------------------------------------------


    /**
     * Generates an open web joist with the given options for reinforcement styles.
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.width - Width of the joist
     * @param {number} opts.length - Length of the joist
     * @param {number} opts.reinforcementLevel - Level of reinforcement (1: basic, 2: moderate, 3: high)
     * @param {number} opts.unitLength - Length of each unit section for webbing
     * @memberof components.reinforcements
     * @author R. J. Salvador (Salvador Workshop)
     */
    const reinforcedJoist = (opts) => {
        const defaults = reinforcedJoistDefaults()

        // User options
        const {
            interfaceThickness = defaults.opts.interfaceThickness,
            width = defaults.opts.width,
            length = defaults.opts.length,
            reinforcementLevel = defaults.opts.reinforcementLevel,
            unitLength = defaults.opts.unitLength,
        } = opts

        const inOpts = {
            interfaceThickness,
            width,
            length,
            reinforcementLevel,
            unitLength,
        }


        const modelProperties = reinforcedJoistProps(inOpts)

        /* ----------------------------------------
         * Modelling, Component/Assembly Modules
         * ------------------------------------- */


        const framePanelWebs = (modelProps) => {
            const {
                reinforcementLevel
            } = modelProps.opts

            const {
                lengthUnits,
                unitLength,
                length,
                interfaceThickness,
                width,
                edgeWidth,
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
                return position.ctr(braceUnit, bucPt)
            })
            braceUnits = union(...braceUnits)

            const edgePts = [
                [0, 0, 0],
                [0, length, 0],
                [braceUnitSize[0], 0, 0],
                [braceUnitSize[0], length, 0],
            ]
            const edgeProfilePts = edgePts.map(edgePt => {
                return position.ctr(interfaceProfileBeads.lg, edgePt)
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

    return reinforcedJoist
}

module.exports = {
    init: reinforcedJoistInit,
}
