/**
 * @file Sheet Mould Module
 * @namespace sheetMould
 * @memberof components
 * @author R. J. Salvador
 */

"use strict"

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
        math,
        position,
    } = swcadJs.calcs

    const {
        beadsBits,
        mesh: meshLib,
    } = swcadJs.components


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.sheetMould
     */
    const modelDefaults = () => {
        /** Specific value declarations */
        const interfaceThickness = 1.333333
        const edgeMargin = math.inchesToMm(1 / 4)
        const modelTypes = {
            default: { id: 'default', desc: 'Default' },
            alt: { id: 'alt', desc: 'Alternate' },
        }

        const defaultValues = {
            opts: {
                type: modelTypes.default.id,
                scale: 1,
                bead: {
                    type: 'cone'
                },
                mesh: {
                    segments: 8
                }
            },
            dims: {
                interfaceThickness,
                fitGap: math.inchesToMm(1 / 128),
                edgeMargin,
                bead: {
                    radius: math.inchesToMm(1 / 16),
                    height: math.inchesToMm(1 / 16),
                },
                mesh: {
                    radius: math.inchesToMm(3 / 32),
                    distance: interfaceThickness * 0.75 + math.inchesToMm(3 / 32),
                    thickness: interfaceThickness,
                    margin: edgeMargin,
                },
            },
            points: {
                dots: [
                    [
                        math.inchesToMm(2),
                        math.inchesToMm(2),
                    ],
                    [
                        math.inchesToMm(-2),
                        math.inchesToMm(2),
                    ],
                    [
                        math.inchesToMm(2),
                        math.inchesToMm(-2),
                    ],
                    [
                        math.inchesToMm(-2),
                        math.inchesToMm(-2),
                    ],
                ],
                lines: [
                    [
                        [
                            math.inchesToMm(1.5),
                            math.inchesToMm(-1.5),
                        ],
                        [
                            math.inchesToMm(1.5),
                            math.inchesToMm(1.5),
                        ],
                    ],
                    [
                        [
                            math.inchesToMm(-1.5),
                            math.inchesToMm(-1.5),
                        ],
                        [
                            math.inchesToMm(-1.5),
                            math.inchesToMm(1.5),
                        ],
                    ],
                ],
            }
        }

        /** Options used by SW models */
        const standardOpts = {
            type: defaultValues.opts.type,
            scale: 1,
            interfaceThickness: 1.333333,
            fitGap: math.inchesToMm(1 / 128),
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            ...standardOpts,
            bead: {
                type: defaultValues.opts.bead.type,
                radius: defaultValues.dims.bead.radius,
                height: defaultValues.dims.bead.height,
            },
            mesh: {
                segments: defaultValues.opts.mesh.segments,
                radius: defaultValues.dims.mesh.radius,
                distance: defaultValues.dims.mesh.distance,
                thickness: defaultValues.dims.mesh.thickness,
                margin: defaultValues.dims.mesh.margin,
            },
            edgeMargin: defaultValues.dims.edgeMargin,
            dots: defaultValues.points.dots,
            lines: defaultValues.points.lines,
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
     * @memberof components.sheetMould
     */
    const modelOpts = (opts) => {
        const defaults = modelDefaults()
        console.log('modelOpts() -- opts', opts)

        // User options
        const {
            size = defaults.opts.size,
            type = defaults.opts.type,
            scale = defaults.opts.scale,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
            bead = defaults.opts.bead,
            mesh = defaults.opts.mesh,
            edgeMargin = defaults.opts.edgeMargin,
            dots = defaults.opts.dots,
            lines = defaults.opts.lines,
        } = opts

        const stdOpts = {
            type,
            scale,
            interfaceThickness,
            fitGap,
        }

        const initOpts = {
            bead,
            mesh,
            edgeMargin,
            dots,
            lines,
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
     * @memberof components.sheetMould
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()
        console.log('modelProps() -- opts', opts)

        const {
            size,
            type,
            scale,
            interfaceThickness,
            fitGap,
            bead,
            mesh,
            edgeMargin,
            dots,
            lines,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        // const width = size[0]
        // const depth = size[1]
        // const height = size[2]

        const lgProfileBeadWidth = interfaceThickness * 1.75
        const mdProfileBeadWidth = interfaceThickness * 1.5
        const smProfileBeadWidth = interfaceThickness * 1.125

        let width = null
        let depth = null

        let minX = Number.MAX_VALUE
        let minY = Number.MAX_VALUE

        let maxX = Number.MIN_VALUE
        let maxY = Number.MIN_VALUE

        const checkPt = (pt) => {
            const currentX = pt[0]
            const currentY = pt[1]

            if (currentX < minX) {
                minX = currentX
            } else if (currentX > maxX) {
                maxX = currentX
            }

            if (currentY < minY) {
                minY = currentY
            } else if (currentY > maxY) {
                maxY = currentY
            }
        }

        dots.forEach(dot => {
            checkPt(dot)
        })

        lines.forEach(line => {
            line.forEach(linePt => {
                checkPt(linePt)
            })
        })

        const distX = maxX - minX
        const distY = maxY - minY
        const distHalfX = distX / 2
        const distHalfY = distY / 2

        let ctrX = minX + distHalfX
        let ctrY = minY + distHalfY

        let ctrOffsetX = 0
        let ctrOffsetY = 0

        if (size) {
            width = size[0]
            depth = size[1]
        } else {
            width = edgeMargin * 2 + distX
            depth = edgeMargin * 2 + distY
        }

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
            bead: {
                type: bead.type,
            },
            mesh: {
                segments: mesh.segments,
            },
        }

        /** Various dimensions for model */
        const modelDims = {
            // size,
            // interfaceThickness,
            // fitGap,
            // width,
            // depth,
            // height,
            interfaceThickness,
            fitGap,
            width,
            depth,
            bead: {
                radius: bead.radius,
                height: bead.height,
            },
            mesh: {
                radius: mesh.radius,
                distance: mesh.distance,
                margin: mesh.margin,
                thickness: mesh.thickness,
            },
        }

        /** Various key points for model */
        const modelPoints = {
            centre: [ctrX, ctrY, 0],
            dots,
            lines,
        }

        /** Components used by model */
        const modelComponents = {
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


    //------------------------------------------------------------------------------


    /**
     * New Model
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.sheetMould
     */
    const model = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        /* ----------------------------------------
         * Modelling, Component/Assembly Modules
         * ------------------------------------- */

        const mouldBase = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps
            console.log('mouldBase(), modelProps', modelProps)

            const meshTextureSlab = meshLib.meshPanel({
                size: [dims.width, dims.depth, dims.interfaceThickness],
                holeRadius: dims.mesh.radius,
                holeDistance: dims.mesh.distance,
                edgeMargin: dims.mesh.margin,
            })

            return meshTextureSlab
        }


        const mouldPtSupportCore = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            const edgeMouldSupport = cylinder({
                height: dims.interfaceThickness,
                radius: dims.bead.radius
            })

            return edgeMouldSupport
        }

        const mouldPointSupport = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            const edgeMouldSupport = mouldPtSupportCore(modelProps)
            const mouldSupportFlange = cuboid({
                size: [
                    dims.mesh.radius * 2.125,
                    dims.interfaceThickness,
                    dims.interfaceThickness
                ]
            })
            let holeMouldSupport = union(edgeMouldSupport, mouldSupportFlange)

            return holeMouldSupport
        }


        const mouldPoint = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            const holeMouldPoint = cylinderElliptic({
                height: dims.bead.height,
                startRadius: [dims.bead.radius, dims.bead.radius],
                endRadius: [0, 0]
            })

            return holeMouldPoint
        }

        const mouldPtAssembly = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            const hMouldPoint = mouldPoint(modelProps)

            const holeMould = union(
                position.ctrMax(mouldPtSupportCore(modelProps)),
                position.ctrMin(hMouldPoint),
            )
            return holeMould
        }

        const mouldPtFlangedAssembly = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            const hMouldPoint = mouldPoint(modelProps)

            const holeMould = union(
                position.ctrMax(mouldPointSupport(modelProps)),
                position.ctrMin(hMouldPoint),
            )
            return holeMould
        }


        const dotMoulds = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            console.log('dotMoulds() modelProps', modelProps)

            let holeMoulds = []
            points.dots.forEach((pt) => {
                holeMoulds.push(
                    align(
                        {
                            modes: ['center', 'center', 'min'],
                            relativeTo: [pt[0], pt[1], 0],
                        },
                        mouldPtFlangedAssembly(modelProps)
                    )
                )
            })

            let holeMouldSet = null

            if (holeMoulds.length > 0) {
                holeMouldSet = union(...holeMoulds)
            }

            return holeMouldSet
        }


        const lineMoulds = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps
            console.log('lineMoulds() modelProps', modelProps)

            const lineMouldPoints = []
            points.lines.forEach((linePoints) => {

                const lineSet = linePoints.map((linePt) => {
                    console.log('lineMoulds() linePt', linePt)

                    return translate([
                        linePt[0],
                        linePt[1],
                        0
                    ], mouldPtAssembly(modelProps))
                })
                lineMouldPoints.push(hullChain(...lineSet))
            })

            console.log('lineMoulds() lineMouldPoints', lineMouldPoints)

            const lineMouldAssemblies = union(...lineMouldPoints)

            return lineMouldAssemblies
        }


        /* ----------------------------------------
         * Complete Assembly
         * ------------------------------------- */

        /** Final Assembly */
        const finalAssembly = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            let mainPart = position.ctrMin(mouldBase(modelProps))

            const dMould = dotMoulds(modelProps)
            const lMould = lineMoulds(modelProps)

            if (dMould) {
                mainPart = union(
                    mainPart,
                    position.ctrMin(dMould),
                )
            }

            if (lMould) {
                mainPart = union(
                    mainPart,
                    position.ctrMin(lMould),
                )
            }

            return mainPart
        }


        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */

        let mouldPointInst = mouldPoint(modelProperties)
        let mouldPointSupportInst = mouldPointSupport(modelProperties)
        let dotMouldsInst = dotMoulds(modelProperties)
        let lineMouldsInst = lineMoulds(modelProperties)

        let mainModel = finalAssembly(modelProperties)

        let modelParts = {
            mouldPoint: mouldPointInst,
            mouldPointSupport: mouldPointSupportInst,
            dotMoulds: dotMouldsInst,
            lineMoulds: lineMouldsInst,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return model
}

module.exports = {
    init: moduleInit
}
