"use strict"

const reinforcedLengthInit = ({ jscad, swcadJs }) => {
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
        geometry,
    } = swcadJs.calcs

    const {
        reinforcements,
    } = swcadJs.components


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof reinforcedLength
     * @access private
     */
    const reinforcedLengthDefaults = () => {
        const defInterfaceThickness = standards.INTERFACE_THICKNESS
        const defFitGap = standards.FIT_GAP

        const defaultValues = {
            dims: {
                size: [
                    math.inchesToMm(3.5),
                    math.inchesToMm(5 / 16),
                    math.inchesToMm(1 / 8),
                ],
                unitLength: math.inchesToMm(1),
                baseThickness: defInterfaceThickness,
                reinforcementThickness: 1.125,
            }
        }

        const defaultOpts = {
            size: defaultValues.dims.size,
            unitLength: defaultValues.dims.unitLength,
            baseThickness: defaultValues.dims.baseThickness,
            reinforcementThickness: defaultValues.dims.reinforcementThickness,
        }

        return {
            vals: defaultValues,
            opts: defaultOpts,
        }
    }


    //------------------------------------------------------------------------------


    /**
     * Initializes options with user input
     * @param {*} opts 
     * @returns model properties
     * @memberof reinforcedLength
     * @access private
     */
    const reinforcedLengthOpts = (opts) => {
        const defaults = reinforcedLengthDefaults()

        // User options
        const {
            size = defaults.opts.size,
            unitLength = defaults.opts.unitLength,
            baseThickness = defaults.opts.baseThickness,
            reinforcementThickness = defaults.opts.reinforcementThickness,
        } = opts

        const initOpts = {
            size,
            unitLength,
            baseThickness,
            reinforcementThickness,
        }

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof reinforcedLength
     * @access private
     */
    const reinforcedLengthProps = (opts) => {
        const defaults = reinforcedLengthDefaults()

        const {
            size,
            unitLength,
            baseThickness,
            reinforcementThickness,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const length = size[0]
        const width = size[1]
        const height = size[2]

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = {
        }

        /** Derived user options for the model */
        const modelOpts = {
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            unitLength,
            baseThickness,
            reinforcementThickness,
            length,
            width,
            height,
        }

        /** Various key points for model */
        const modelPoints = {
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

    /* ---------------------------------------
    * SUB-COMPONENTS
    * ------------------------------------- */

    const reinforcementUnitBase = (opts) => {
        const {
            length,
            width,
            baseThickness
        } = opts

        return cuboid({ size: [length, width, baseThickness] })
    }

    const lightLengthReinforcement = (opts) => {
        const {
            length,
            reinforcementThickness,
            spineHeight
        } = opts

        const spine = cuboid({ size: [length, reinforcementThickness, spineHeight] })
        return spine
    }

    const mediumLengthReinforcement = (opts) => {
        const {
            length,
            width,
            reinforcementThickness,
            spineHeight
        } = opts

        const spine = cuboid({ size: [length, reinforcementThickness, spineHeight] })
        const spacing = width / 3
        const spines = [
            translate([0, spacing / 2 + (reinforcementThickness / 2), 0], spine),
            translate([0, spacing / -2 - (reinforcementThickness / 2), 0], spine),
        ]

        return union(spines)
    }

    const heavyLengthReinforcement = (opts) => {
        const {
            length,
            width,
            thickness,
            reinforcementThickness
        } = opts
        return reinforcements.reinforcedRectPanel({
            size: [length, width, thickness],
            reinforcementPattern: 'x',
            reinforcementThickness: [reinforcementThickness, reinforcementThickness, reinforcementThickness]
        })[0]
    }

    const lightReinforcedLengthUnit = (opts) => {
        const {
            size,
            baseThickness,
            reinforcementThickness
        } = opts

        // Generate flat base
        const lightReinfUnitBase = reinforcementUnitBase({
            length: size[0],
            width: size[1],
            baseThickness: baseThickness
        })
        // Generate reinforcement
        const lightReinfUnitReinforcement = lightLengthReinforcement({
            length: size[0],
            reinforcementThickness: reinforcementThickness,
            spineHeight: size[2],
        })

        // End pieces
        const endPiece = cuboid({
            size: [
                reinforcementThickness,
                size[1],
                size[2]
            ]
        })
        const endPiece1 = align(
            {
                modes: ['min', 'center', 'min'],
                relativeTo: [size[0] / -2, 0, 0]
            },
            endPiece
        )
        const endPiece2 = align(
            {
                modes: ['max', 'center', 'min'],
                relativeTo: [size[0] / 2, 0, 0]
            },
            endPiece
        )

        // Combine all pieces
        const lightReinfUnitAssembly = union(
            position.ctrMin(lightReinfUnitBase),
            position.ctrMin(lightReinfUnitReinforcement),
            endPiece1,
            endPiece2,
        )

        return position.ctr(lightReinfUnitAssembly)
    }

    const mediumReinforcedLengthUnit = (opts) => {
        const {
            size,
            baseThickness,
            reinforcementThickness
        } = opts

        // Generate flat base
        const mediumReinfUnitBase = reinforcementUnitBase({
            length: size[0],
            width: size[1],
            baseThickness: baseThickness
        })

        // Generate reinforcement
        const mediumReinfUnitReinforcement = mediumLengthReinforcement({
            length: size[0],
            width: size[1],
            reinforcementThickness: reinforcementThickness,
            spineHeight: size[2],
        })

        // End pieces
        const endPiece = cuboid({
            size: [
                reinforcementThickness,
                size[1],
                size[2]
            ]
        })
        const endPiece1 = align(
            {
                modes: ['min', 'center', 'min'],
                relativeTo: [size[0] / -2, 0, 0]
            },
            endPiece
        )
        const endPiece2 = align(
            {
                modes: ['max', 'center', 'min'],
                relativeTo: [size[0] / 2, 0, 0]
            },
            endPiece
        )

        // Combine all pieces
        const mediumReinfUnitAssembly = union(
            position.ctrMin(mediumReinfUnitBase),
            position.ctrMin(mediumReinfUnitReinforcement),
            endPiece1,
            endPiece2,
        )

        return position.ctr(mediumReinfUnitAssembly)
    }

    const heavyReinforcedLengthUnit = (opts) => {
        const {
            size,
            baseThickness,
            reinforcementThickness
        } = opts

        // Generate flat base
        const reinfUnitBase = reinforcementUnitBase({
            length: size[0],
            width: size[1],
            baseThickness: baseThickness
        })

        const reinfUnitReinforcement = heavyLengthReinforcement({
            length: size[0],
            width: size[1],
            thickness: size[2],
            reinforcementThickness: reinforcementThickness,
        })

        // Combine all pieces
        const reinfUnitAssembly = union(
            position.ctrMin(reinfUnitBase),
            position.ctrMin(reinfUnitReinforcement)
        )

        return position.ctr(reinfUnitAssembly)
    }

    const outputKeepBox = (opts) => {
        const { size } = opts

        return cuboid({
            size: [
                size[0],
                size[1] * 1.5,
                size[2] * 1.5,
            ]
        })
    }

    /* ---------------------------------------
    * EXPOSED MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * Light reinforcement length
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedLength
     */
    const lightReinforcedLength = (opts) => {
        const defaults = reinforcedLengthDefaults()
        const initOpts = reinforcedLengthOpts(opts)
        const modelProperties = reinforcedLengthProps(initOpts)

        const {
            size,
            unitLength,
            baseThickness,
            reinforcementThickness
        } = modelProperties.dims

        const lightLengthUnitBase = lightReinforcedLengthUnit({
            size: [unitLength, size[1], size[2]],
            baseThickness,
            reinforcementThickness,
        })

        // Attach unit base segments until the desired length is reached.
        const numUnits = Math.ceil(size[0] / unitLength) + 1
        const lengthOffset = unitLength - reinforcementThickness
        let lightReinfLengthAssembly = lightLengthUnitBase

        for (let assemblyIdx = 1; assemblyIdx < numUnits; assemblyIdx++) {
            const currentOffset = assemblyIdx * lengthOffset
            lightReinfLengthAssembly = union(
                lightReinfLengthAssembly,
                translate(
                    [currentOffset, 0, 0],
                    lightLengthUnitBase
                )
            )
        }

        // End pieces
        const endPiece = cuboid({
            size: [
                reinforcementThickness,
                size[1],
                size[2]
            ]
        })

        const lightReinfLength = intersect(
            position.ctr(lightReinfLengthAssembly),
            outputKeepBox({ size })
        )

        const mainModel = lightReinfLength
        const modelParts = {
            mainModel,
            unit: lightLengthUnitBase,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Medium reinforcement length
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedLength
     */
    const mediumReinforcedLength = (opts) => {
        const defaults = reinforcedLengthDefaults()
        const initOpts = reinforcedLengthOpts(opts)
        const modelProperties = reinforcedLengthProps(initOpts)

        const {
            size,
            unitLength,
            baseThickness,
            reinforcementThickness
        } = modelProperties.dims

        const mediumLengthUnitBase = mediumReinforcedLengthUnit({
            size: [unitLength, size[1], size[2]],
            baseThickness,
            reinforcementThickness,
        })

        // Attach unit base segments until the desired length is reached.
        const numUnits = Math.ceil(size[0] / unitLength) + 1
        const lengthOffset = unitLength - reinforcementThickness
        let mediumReinfLengthAssembly = mediumLengthUnitBase

        for (let assemblyIdx = 1; assemblyIdx < numUnits; assemblyIdx++) {
            const currentOffset = assemblyIdx * lengthOffset
            mediumReinfLengthAssembly = union(
                mediumReinfLengthAssembly,
                translate(
                    [currentOffset, 0, 0],
                    mediumLengthUnitBase
                )
            )
        }

        // End pieces
        const endPiece = cuboid({
            size: [
                reinforcementThickness,
                size[1],
                size[2]
            ]
        })

        const mediumReinfLength = intersect(
            position.ctr(mediumReinfLengthAssembly),
            outputKeepBox({ size })
        )

        const mainModel = mediumReinfLength
        const modelParts = {
            mainModel,
            unit: mediumLengthUnitBase
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Heavy reinforcement length
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedLength
     */
    const heavyReinforcedLength = (opts) => {
        const defaults = reinforcedLengthDefaults()
        const initOpts = reinforcedLengthOpts(opts)
        const modelProperties = reinforcedLengthProps(initOpts)

        const {
            size,
            unitLength,
            baseThickness,
            reinforcementThickness
        } = modelProperties.dims

        const heavyLengthUnitBase = heavyReinforcedLengthUnit({
            size: [unitLength, size[1], size[2]],
            baseThickness,
            reinforcementThickness,
        })

        // Attach unit base segments until the desired length is reached.
        const numUnits = Math.ceil(size[0] / unitLength) + 1
        const lengthOffset = unitLength - reinforcementThickness
        let heavyReinfLengthAssembly = heavyLengthUnitBase

        for (let assemblyIdx = 1; assemblyIdx < numUnits; assemblyIdx++) {
            const currentOffset = assemblyIdx * lengthOffset
            heavyReinfLengthAssembly = union(
                heavyReinfLengthAssembly,
                translate(
                    [currentOffset, 0, 0],
                    heavyLengthUnitBase
                )
            )
        }

        // End pieces
        const endPiece = cuboid({
            size: [
                reinforcementThickness,
                size[1],
                size[2]
            ]
        })

        const heavyReinfLength = intersect(
            position.ctr(heavyReinfLengthAssembly),
            outputKeepBox({ size })
        )

        const mainModel = heavyReinfLength
        const modelParts = {
            mainModel,
            unit: heavyLengthUnitBase
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Modelling functions that generate reinforcement reinforcedLength
     * @namespace reinforcedLength
     * @memberof components.reinforcements
     */
    return {
        defaults: reinforcedLengthDefaults,
        props: reinforcedLengthProps,
        lightReinforcedLength,
        mediumReinforcedLength,
        heavyReinforcedLength,
    }
}

module.exports = {
    init: reinforcedLengthInit
}
