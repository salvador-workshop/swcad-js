"use strict"

const reinforcedRingInit = ({ jscad, swcadJs }) => {
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
    } = swcadJs.calcs


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof reinforcedRing
     * @access private
     */
    const reinforcedRingDefaults = () => {
        const defInterfaceThickness = standards.INTERFACE_THICKNESS
        const defFitGap = standards.FIT_GAP

        const defaultValues = {
            constants: {
                defInterfaceThickness: defInterfaceThickness,
            },
            opts: {},
            dims: {
                height: math.inchesToMm(1 / 8),
                holeRadius: math.inchesToMm(1 / 8),
                ringWidth: math.inchesToMm(3 / 16),
                baseThickness: defInterfaceThickness,
                reinforcementThickness: 1.125,
                fitGap: defFitGap,
            },
            points: {},
            components: {},
        }

        const defaultOpts = {
            height: defaultValues.dims.height,
            holeRadius: defaultValues.dims.holeRadius,
            ringWidth: defaultValues.dims.ringWidth,
            baseThickness: defaultValues.dims.baseThickness,
            reinforcementThickness: defaultValues.dims.reinforcementThickness,
            fitGap: defaultValues.dims.fitGap,
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
     * @memberof reinforcedRing
     * @access private
     */
    const reinforcedRingOpts = (opts) => {
        const defaults = reinforcedRingDefaults()
        console.log('reinforcedRingOpts() -- opts', opts)

        // User options
        const {
            height = defaults.opts.height,
            holeRadius = defaults.opts.holeRadius,
            ringWidth = defaults.opts.ringWidth,
            baseThickness = defaults.opts.baseThickness,
            reinforcementThickness = defaults.opts.reinforcementThickness,
            fitGap = defaults.opts.fitGap,
        } = opts

        const initOpts = {
            height,
            holeRadius,
            ringWidth,
            baseThickness,
            reinforcementThickness,
            fitGap
        }

        console.log('reinforcedRingOpts() -- initOpts', initOpts)

        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof reinforcedRing
     * @access private
     */
    const reinforcedRingProps = (opts) => {
        const defaults = reinforcedRingDefaults()
        console.log('reinforcedRingProps() -- opts', opts)

        const {
            height,
            holeRadius,
            ringWidth,
            baseThickness,
            reinforcementThickness,
            fitGap
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const holeDiam = holeRadius * 2

        const ringBlankRadius = holeRadius + ringWidth
        const ringBlankDiam = ringBlankRadius * 2

        const ringHoleCutRadius = holeRadius + (fitGap / 2)
        const ringIntReinfBlankRadius = holeRadius + reinforcementThickness
        const ringExtReinfHoleCutRadius = ringBlankRadius - reinforcementThickness

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = defaults.vals.constants

        /** Derived user options for the model */
        const modelOpts = defaults.vals.opts

        /** Various dimensions for model */
        const modelDims = {
            height,
            holeRadius,
            ringWidth,
            baseThickness,
            reinforcementThickness,
            fitGap,
            holeDiam,
            ringBlankRadius,
            ringBlankDiam,
            ringHoleCutRadius,
            ringIntReinfBlankRadius,
            ringExtReinfHoleCutRadius,
        }

        /** Various key points for model */
        const modelPoints = defaults.vals.points

        /** Components used by model */
        const modelComponents = defaults.vals.components

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

        console.log('reinforcedRingProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    const ringReinforcementBase = (opts) => {
        const {
            baseThickness,
            ringBlankRadius,
            ringHoleCutRadius,
        } = opts

        const ringBlank = cylinder({
            height: baseThickness,
            radius: ringBlankRadius
        })
        const ringCutCylinder = cylinder({
            height: baseThickness * 2,
            radius: ringHoleCutRadius
        })

        return subtract(ringBlank, ringCutCylinder)
    }

    const ringReinforcementInnerEdge = (opts) => {
        const {
            height,
            ringIntReinfBlankRadius,
            ringHoleCutRadius,
        } = opts

        const ringReinfInBlank = cylinder({
            height: height,
            radius: ringIntReinfBlankRadius
        })

        const ringReinfInCutCylinder = cylinder({
            height: height * 2,
            radius: ringHoleCutRadius
        })

        return subtract(ringReinfInBlank, ringReinfInCutCylinder)
    }

    const ringReinforcementOuterEdge = (opts) => {
        const {
            height,
            ringBlankRadius,
            ringExtReinfHoleCutRadius,
        } = opts

        const ringReinfOutBlank = cylinder({
            height: height,
            radius: ringBlankRadius
        })

        const ringReinfOutCutCylinder = cylinder({
            height: height * 2,
            radius: ringExtReinfHoleCutRadius
        })

        return subtract(ringReinfOutBlank, ringReinfOutCutCylinder)
    }

    const ringReinforcementSpokes = (opts) => {
        const {
            reinforcementThickness,
            height,
            ringBlankDiam,
            ringHoleCutRadius,
        } = opts

        const spokeReinforcementBase = cuboid({
            size: [reinforcementThickness, ringBlankDiam - reinforcementThickness, height]
        })

        const spokeReinforcements = union(
            spokeReinforcementBase,
            rotate([0, 0, TAU / 8], spokeReinforcementBase),
            rotate([0, 0, TAU / 4], spokeReinforcementBase),
            rotate([0, 0, TAU * .375], spokeReinforcementBase),
        )

        const ringReinfInCutCylinder = cylinder({
            height: height * 2,
            radius: ringHoleCutRadius
        })

        return subtract(spokeReinforcements, ringReinfInCutCylinder)
    }

    //------------------------------------------------------------------------------

    /**
     * New Model 1
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedRing
     */
    const lightReinforcedRing = (opts) => {
        const defaults = reinforcedRingDefaults()
        const initOpts = reinforcedRingOpts(opts)
        const modelProperties = reinforcedRingProps(initOpts)

        const {
            height,
            holeRadius,
            ringWidth,
            baseThickness,
            reinforcementThickness,
            fitGap,
            holeDiam,
            ringBlankRadius,
            ringBlankDiam,
            ringHoleCutRadius,
            ringIntReinfBlankRadius,
            ringExtReinfHoleCutRadius,
        } = modelProperties.dims

        const ringReinfBase = ringReinforcementBase({
            baseThickness,
            ringBlankRadius,
            ringHoleCutRadius,
        })
        const ringReinfInnerEdge = ringReinforcementInnerEdge({
            height,
            ringIntReinfBlankRadius,
            ringHoleCutRadius,
        })

        const lightRingAssemblyParts = [
            position.ctrMin(ringReinfBase),
            position.ctrMin(ringReinfInnerEdge),
        ]

        const ringAssembly = union(...lightRingAssemblyParts)

        const mainModel = position.ctr(ringAssembly)
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * New Model 2
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedRing
     */
    const mediumReinforcedRing = (opts) => {
        const defaults = reinforcedRingDefaults()
        const initOpts = reinforcedRingOpts(opts)
        const modelProperties = reinforcedRingProps(initOpts)

        const {
            height,
            holeRadius,
            ringWidth,
            baseThickness,
            reinforcementThickness,
            fitGap,
            holeDiam,
            ringBlankRadius,
            ringBlankDiam,
            ringHoleCutRadius,
            ringIntReinfBlankRadius,
            ringExtReinfHoleCutRadius,
        } = modelProperties.dims


        const ringReinfBase = ringReinforcementBase({
            baseThickness,
            ringBlankRadius,
            ringHoleCutRadius,
        })
        const ringReinfInnerEdge = ringReinforcementInnerEdge({
            height,
            ringIntReinfBlankRadius,
            ringHoleCutRadius,
        })
        const ringReinfSpokes = ringReinforcementSpokes({
            reinforcementThickness,
            height,
            ringBlankDiam,
            ringHoleCutRadius,
        })

        const mediumRingAssemblyParts = [
            position.ctrMin(ringReinfBase),
            position.ctrMin(ringReinfInnerEdge),
            position.ctrMin(ringReinfSpokes),
        ]

        const ringAssembly = union(...mediumRingAssemblyParts)

        const mainModel = position.ctr(ringAssembly)
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * ...
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.reinforcements.reinforcedRing
     */
    const heavyReinforcedRing = (opts) => {
        const defaults = reinforcedRingDefaults()
        const initOpts = reinforcedRingOpts(opts)
        const modelProperties = reinforcedRingProps(initOpts)

        const {
            height,
            holeRadius,
            ringWidth,
            baseThickness,
            reinforcementThickness,
            fitGap,
            holeDiam,
            ringBlankRadius,
            ringBlankDiam,
            ringHoleCutRadius,
            ringIntReinfBlankRadius,
            ringExtReinfHoleCutRadius,
        } = modelProperties.dims


        const ringReinfBase = ringReinforcementBase({
            baseThickness,
            ringBlankRadius,
            ringHoleCutRadius,
        })
        const ringReinfInnerEdge = ringReinforcementInnerEdge({
            height,
            ringIntReinfBlankRadius,
            ringHoleCutRadius,
        })
        const ringReinfSpokes = ringReinforcementSpokes({
            reinforcementThickness,
            height,
            ringBlankDiam,
            ringHoleCutRadius,
        })
        const ringReinfOuterEdge = ringReinforcementOuterEdge({
            height,
            ringBlankRadius,
            ringExtReinfHoleCutRadius,
        })

        const heavyRingAssemblyParts = [
            position.ctrMin(ringReinfBase),
            position.ctrMin(ringReinfInnerEdge),
            position.ctrMin(ringReinfSpokes),
            position.ctrMin(ringReinfOuterEdge),
        ]

        const ringAssembly = union(...heavyRingAssemblyParts)

        const mainModel = position.ctr(ringAssembly)
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Modelling functions that generate reinforcement rings
     * @namespace reinforcedRing
     * @memberof components.reinforcements
     */
    return {
        defaults: reinforcedRingDefaults,
        props: reinforcedRingProps,
        lightReinforcedRing,
        mediumReinforcedRing,
        heavyReinforcedRing,
    }
}

module.exports = {
    init: reinforcedRingInit
}
