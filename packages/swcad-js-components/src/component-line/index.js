"use strict"

/**
 * Component Line
 * @param {*} opts 
 * @namespace componentLine
 * @memberof components
 * @author R. J. Salvador (Salvador Workshop)
 * @version 1.3.0
 */

const moduleInit = ({ jscad, swcadJs }) => {
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
        constants,
    } = swcadJs.data

    const {
        math,
        position,
        geometry,
    } = swcadJs.calcs

    const {
        beadsBits,
    } = swcadJs.components


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.componentLine
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
                centre: [0, 0, 0],
                startPt: [math.inchesToMm(0.5), math.inchesToMm(0.5)],
                endPt: [math.inchesToMm(3), math.inchesToMm(4)],
            },
            types: {
                default: { id: 'default', desc: 'Default' },
                alt: { id: 'alt', desc: 'Alternate' },
            },
            component: cuboid({
                size: [
                    math.inchesToMm(6 / 16),
                    math.inchesToMm(9 / 16),
                    math.inchesToMm(3 / 16),
                ]
            }),
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
            unitLength: math.inchesToMm(1),
            startPt: defaultValues.points.startPt,
            endPt: defaultValues.points.endPt,
            endOffset: 0,
            baseLineOffset: 0,
            component: defaultValues.component,
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
     * @memberof components.componentLine
     */
    const modelOpts = (opts) => {
        const defaults = modelDefaults()
        console.log('modelOpts() -- opts', opts)

        // User options
        const {
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
            unitLength = defaults.opts.unitLength,
            type = defaults.opts.type,
            scale = defaults.opts.scale,
            startPt = defaults.opts.startPt,
            endPt = defaults.opts.endPt,
            endOffset = defaults.opts.endOffset,
            baseLineOffset = defaults.opts.baseLineOffset,
            component = defaults.opts.component,
        } = opts

        const stdOpts = {
            type,
            scale,
            interfaceThickness,
            fitGap,
        }

        const initOpts = {
            unitLength,
            startPt,
            endPt,
            endOffset,
            baseLineOffset,
            component,
            ...stdOpts,
        }

        console.log('modelOpts() -- initOpts', initOpts)

        return initOpts
    }

    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof components.componentLine
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()
        console.log('modelProps() -- opts', opts)

        const {
            interfaceThickness,
            fitGap,
            unitLength,
            type,
            scale,
            startPt,
            endPt,
            endOffset,
            baseLineOffset,
            component,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const coordDiffs = [
            endPt[0] - startPt[0],
            endPt[1] - startPt[1],
        ]
        const midPt = [
            startPt[0] + (coordDiffs[0] / 2),
            startPt[1] + (coordDiffs[1] / 2),
        ]

        const lineLength = Math.hypot(coordDiffs[0], coordDiffs[1])
        const offsetLineLength = lineLength - (endOffset * 2)

        const numSubLengths = Math.floor(offsetLineLength / unitLength)
        const componentUnits = numSubLengths + 1

        const componentDims = measureDimensions(component)
        const componentBoundingBox = measureBoundingBox(component)

        const componentLineLength = offsetLineLength - componentDims[0]
        const componentUnitLength = componentLineLength / numSubLengths
        const compLineAngle = geometry.angleOfTwoPtLine(startPt, endPt)

        const lgProfileBeadWidth = interfaceThickness * 1.75
        const mdProfileBeadWidth = interfaceThickness * 1.5
        const smProfileBeadWidth = interfaceThickness * 1.125

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
            type,
            scale,
        }

        /** Derived user options for the model */
        const modelOpts = {
            type,
            scale,
            types: defaults.vals.types,
            componentUnits,
        }

        /** Various dimensions for model */
        const modelDims = {
            interfaceThickness,
            fitGap,
            unitLength,
            componentUnitLength,
            lineLength,
            offsetLineLength,
            componentLineLength,
            componentDims,
            componentBoundingBox,
            endOffset,
            baseLineOffset,
            lgProfileBeadWidth,
            mdProfileBeadWidth,
            smProfileBeadWidth,
            compLineAngle,
        }

        /** Various key points for model */
        const modelPoints = {
            centre: defaults.vals.points.centre,
            startPt,
            midPt,
            endPt,
        }

        /** Components used by model */
        const modelComponents = {
            component,
            interface: {
                profileBeads: beadsBits.interface3d.profileBeads(
                    interfaceThickness,
                    smProfileBeadWidth,
                    mdProfileBeadWidth,
                    lgProfileBeadWidth,
                ),
            }
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

        console.log('modelProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    /**
     * Component Line
     * @param {*} opts 
     * @returns `geom3` or `geom3[]`
     * @author R. J. Salvador (Salvador Workshop)
     */
    const model = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)



        /* ----------------------------------------
         * Modelling, Component/Assembly Modules
         * ------------------------------------- */

        const interfaceProfileBeads = (modelProps) => {
            const {
                interfaceThickness,
                lgProfileBeadWidth,
                mdProfileBeadWidth,
                smProfileBeadWidth,
            } = modelProps.dims

            const edgeOffset = interfaceThickness / constants.TRI_30_FACTOR / 2

            const lgTopWidth = lgProfileBeadWidth - (edgeOffset * 2)
            const mdTopWidth = mdProfileBeadWidth - (edgeOffset * 2)
            const smTopWidth = smProfileBeadWidth - (edgeOffset * 2)

            const lgProfile = cylinderElliptic({
                height: interfaceThickness,
                startRadius: [lgProfileBeadWidth / 2, lgProfileBeadWidth / 2],
                endRadius: [lgTopWidth / 2, lgTopWidth / 2]
            })

            const mdProfile = cylinderElliptic({
                height: interfaceThickness,
                startRadius: [mdProfileBeadWidth / 2, mdProfileBeadWidth / 2],
                endRadius: [mdTopWidth / 2, mdTopWidth / 2]
            })

            const smProfile = cylinderElliptic({
                height: interfaceThickness,
                startRadius: [smProfileBeadWidth / 2, smProfileBeadWidth / 2],
                endRadius: [smTopWidth / 2, smTopWidth / 2]
            })

            return {
                lg: lgProfile,
                md: mdProfile,
                sm: smProfile,
            }
        }


        /** Straight line from start point to end point. */
        const baseLine = (modelProps) => {
            const {
                startPt,
                endPt
            } = modelProps.points

            const beadProfile = interfaceProfileBeads(modelProps).md

            return hull(
                translate([startPt[0], startPt[1], 0], beadProfile),
                translate([endPt[0], endPt[1], 0], beadProfile),
            )
        }

        /** Sub-component 02 */
        const componentSet = (modelProps) => {
            const {
                component
            } = modelProps.components

            const {
                componentUnits
            } = modelProps.opts

            const {
                interfaceThickness,
                fitGap,
                unitLength,
                componentUnitLength,
                lineLength,
                componentDims,
                componentBoundingBox,
            } = modelProps.dims

            const lineComponents = []

            for (let idx = 0; idx < componentUnits; idx++) {
                // console.log('offset', idx * unitLength)
                lineComponents.push(translate(
                    [idx * componentUnitLength, 0, 0],
                    position.ctr(component)
                ))
            }

            const cSet = position.ctr(union(...lineComponents))

            return cSet
        }

        /** Assembly 01 */
        const cutBox = (modelProps) => {
            const {
                interfaceThickness,
                fitGap,
                unitLength,
                lineLength,
                componentDims,
                componentBoundingBox,
            } = modelProps.dims



            return cuboid({
                size: [
                    lineLength,
                    interfaceThickness * 2 + componentDims[1],
                    interfaceThickness * 2 + componentDims[2],
                ]
            })
        }


        /* ----------------------------------------
         * Complete Assembly
         * ------------------------------------- */


        /** Final Assembly */
        const finalAssembly = (modelProps) => {
            const {
                interfaceThickness,
                fitGap,
                unitLength,
                lineLength,
                componentDims,
                componentBoundingBox,
                baseLineOffset,
                compLineAngle
            } = modelProps.dims

            const {
                startPt,
                midPt,
                endPt,
            } = modelProps.points

            let bLine = baseLine(modelProps)
            let cSet = componentSet(modelProps)
            const midPoint = [midPt[0], midPt[1], 0]

            let a1 = cutBox(modelProps)

            const rotatedCompLine = rotate(
                [0, 0, compLineAngle],
                cSet
            )
            const shiftedCompLine = translate(
                midPoint,
                rotatedCompLine
            )

            const axisOffsetAngle = compLineAngle - (TAU / 4)
            const lineMidPointAdj = geometry.pointFromAngleAndDist(axisOffsetAngle, baseLineOffset)

            const lineMidPoint = [
                midPoint[0] + lineMidPointAdj[0],
                midPoint[1] + lineMidPointAdj[1],
            ]

            const combinedAssembly = union(
                position.ctrMin(bLine, lineMidPoint),
                position.ctrMin(shiftedCompLine, midPoint),
            )

            const cBox = rotate(
                [0, 0, compLineAngle],
                cutBox(modelProps)
            )
            const cutAssembly = intersect(
                position.ctrMin(cBox, midPoint),
                combinedAssembly
            )

            return cutAssembly
        }

        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */


        let baseLineInst = baseLine(modelProperties)
        let componentSetInst = componentSet(modelProperties)
        let cutBoxInst = cutBox(modelProperties)

        let mainPart = finalAssembly(modelProperties)

        let auxParts = {
            baseLine: baseLineInst,
            componentSet: componentSetInst,
            cutBox: cutBoxInst,
        }

        return [mainPart, auxParts, modelProperties]
    }

    return model
}

module.exports = {
    init: moduleInit
}
