"use strict"

const routedShapesInit = ({ jscad, swcadJs }) => {
    const {
        cylinderElliptic,
        cuboid,
    } = jscad.primitives

    const {
        translate,
        rotate,
    } = jscad.transforms

    const {
        subtract,
        union,
    } = jscad.booleans

    const {
        extrudeLinear,
        project
    } = jscad.extrusions

    const { toOutlines } = jscad.geometries.geom2
    const { TAU } = jscad.maths.constants

    const {
        math,
        geometry,
        position,
    } = swcadJs.calcs

    const {
        beadsBits: beadsBits2d,
    } = swcadJs.profiles

    const {
        beadsBits,
    } = swcadJs.components


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.routedShapes
     * @access private
     */
    const modelDefaults = () => {
        /** Specific value declarations */
        const defaultValues = {
            constants: {},
            opts: {},
            dims: {
                size: [
                    math.inchesToMm(3),
                    math.inchesToMm(6),
                    math.inchesToMm(2),
                ],
                height: math.inchesToMm(2),
                radius: [math.inchesToMm(1.5), math.inchesToMm(3)],
            },
            points: {},
            components: {},
            topBit: {
                type: 'chamfer',
                radius1: math.inchesToMm(1 / 2),
                radius2: math.inchesToMm(3 / 4),
                offset1: 0,
                offset2: 0,
                offset3: 0,
                offset4: 0,
            },
            bottomBit: {
                type: 'cove',
                radius1: math.inchesToMm(1 / 2),
                radius2: math.inchesToMm(3 / 4),
                offset1: 0,
                offset2: 0,
                offset3: 0,
                offset4: 0,
            }
        }

        const defaultOpts = {
            size: defaultValues.dims.size,
            height: defaultValues.dims.height,
            radius: defaultValues.dims.radius,
            topBit: defaultValues.topBit.type,
            topBitOpts: defaultValues.topBit,
            bottomBit: defaultValues.bottomBit.type,
            bottomBitOpts: defaultValues.bottomBit,
        }

        return {
            opts: defaultOpts,
            vals: defaultValues,
        }
    }


    //------------------------------------------------------------------------------


    /**
     * Initializes cuboid options with user input
     * @param {*} opts 
     * @returns model properties
     * @memberof components.routedShapes
     * @access private
     */
    const modelCuboidOpts = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            size = defaults.opts.size,
            topBit = defaults.opts.topBit,
            topBitOpts = defaults.opts.topBitOpts,
            bottomBit = defaults.opts.bottomBit,
            bottomBitOpts = defaults.opts.bottomBitOpts,
        } = opts

        const initOpts = {
            size,
            topBit,
            topBitOpts,
            bottomBit,
            bottomBitOpts,
        }

        return initOpts
    }


    /**
     * Initializes cylinder elliptic options with user input
     * @param {*} opts 
     * @returns model properties
     * @memberof components.routedShapes
     * @access private
     */
    const modelCylinderEllipticOpts = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            height = defaults.opts.height,
            radius = defaults.opts.radius,
            topBit = defaults.opts.topBit,
            topBitOpts = defaults.opts.topBitOpts,
            bottomBit = defaults.opts.bottomBit,
            bottomBitOpts = defaults.opts.bottomBitOpts,
        } = opts


        const initOpts = {
            height,
            radius,
            topBit,
            topBitOpts,
            bottomBit,
            bottomBitOpts,
        }


        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof components.routedShapes
     * @access private
     */
    const modelProps = (opts) => {
        const defaults = modelDefaults()

        const {
            size,
            height,
            radius,
            topBit,
            topBitOpts,
            bottomBit,
            bottomBitOpts,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        // ...

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = defaults.vals.constants

        /** Derived user options for the model */
        const modelOpts = {
            topBit,
            bottomBit,
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            height,
            radius,
            topBit: topBitOpts,
            bottomBit: bottomBitOpts,
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


        return modelProperties
    }


    /**
     * Generates cut path for a given router bit
     * @param {*} outlinePts 
     * @param {*} bitProfile 
     * @param {*} bitModel 
     * @returns geom3
     * @memberof components.routedShapes
     * @access private
     */
    const generateRouterCutPath = (outlinePts, bitProfile, bitModel) => {
        const closedOutlinePts = [
            ...outlinePts,
            outlinePts[0]
        ]
        const cutPoints = outlinePts.map(outlinePt => {
            return translate(
                [
                    outlinePt[0],
                    outlinePt[1],
                    0,
                ],
                bitModel
            )
        })

        const lineData = geometry.getLineDataFromOutlinePoints(closedOutlinePts)

        const lineModels = lineData.map(lData => {
            let lineModel = extrudeLinear({ height: lData.length }, bitProfile)
            lineModel = rotate(
                [TAU / 4, 0, TAU / -4],
                lineModel
            )
            lineModel = position.ctr(lineModel)

            let adjLineModel = rotate([0, 0, lData.angle], lineModel)
            adjLineModel = translate([
                lData.mid[0],
                lData.mid[1],
                0,
            ], adjLineModel)

            return adjLineModel
        })

        const cutLines = lineModels

        const cutPath = union(
            ...cutPoints,
            ...cutLines,
        )

        return cutPath
    }


    /**
     * Builds the router cut path from the given details
     * @param {*} outlinePts 
     * @param {*} bitType 
     * @param {*} bitOpts 
     * @returns geom3
     * @memberof components.routedShapes
     * @access private
     */
    const routerCut = (outlinePts, bitType, bitOpts) => {
        let baseRouterBitProfile = null
        let baseRouterBit = null
        /**
         * A 'naive' `cutPathGenMode` allows this function to use a simple `hullChain()`.
         * The complex variant takes a bit more work to build.
         * */
        let cutPathGenMode = 'complex'

        switch (bitType) {
            case 'cove':
                baseRouterBitProfile = beadsBits2d.corner.cove(bitOpts)[0]
                baseRouterBit = beadsBits.corner.cove(bitOpts)[0]
                break;
            case 'roundOver':
                baseRouterBitProfile = beadsBits2d.corner.roundOver(bitOpts)[0]
                baseRouterBit = beadsBits.corner.roundOver(bitOpts)[0]
                break;
            case 'rabbet':
                baseRouterBitProfile = beadsBits2d.corner.rabbet(bitOpts)[0]
                baseRouterBit = beadsBits.corner.rabbet(bitOpts)[0]
                break;
            case 'chamfer':
            default:
                baseRouterBitProfile = beadsBits2d.corner.chamfer(bitOpts)[0]
                baseRouterBit = beadsBits.corner.chamfer(bitOpts)[0]
                cutPathGenMode = 'naive'
                break;
        }

        const cutPath = generateRouterCutPath(outlinePts, baseRouterBitProfile, baseRouterBit)

        return cutPath
    }


    //------------------------------------------------------------------------------


    /**
     * Generates a routed cuboid with the given options for top and bottom edges.
     * @param {Object} opts - Options for the model
     * @param {number[]} opts.size
     * @param {string} opts.topBit
     * @param {Object} opts.topBitOpts
     * @param {string} opts.bottomBit
     * @param {Object} opts.bottomBitOpts
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.routedShapes
     */
    const routedCuboid = (opts) => {
        const initOpts = modelCuboidOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            topBit: topBitType,
            bottomBit: bottomBitType,
        } = modelProperties.opts

        const {
            size,
            topBit,
            bottomBit,
        } = modelProperties.dims

        const baseShape = cuboid({
            size,
        })
        const baseShapeProfile = project({}, baseShape)
        const baseShapeProfileOutlinePts = toOutlines(baseShapeProfile)[0]

        const cutPathTop = routerCut(baseShapeProfileOutlinePts, topBitType, topBit)
        const cutPathBottom = routerCut(baseShapeProfileOutlinePts, bottomBitType, bottomBit)

        let cutShape = baseShape
        const hasTop = !!topBitType && topBitType != 'none'
        const hasBottom = !!bottomBitType && bottomBitType != 'none'

        if (hasTop) {
            cutShape = subtract(
                cutShape,
                translate([0, 0, size[2] / 2], cutPathTop),
            )
        }
        if (hasBottom) {
            cutShape = subtract(
                cutShape,
                translate([0, 0, size[2] / -2], cutPathBottom),
            )
        }

        const mainModel = cutShape
        const modelParts = {
            mainModel,
            cutPathTop,
            cutPathBottom,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a routed elliptical cylinder with the given options for top and bottom edges.
     * @param {Object} opts - Options for the model
     * @param {number} opts.height
     * @param {number[]} opts.radius
     * @param {string} opts.topBit
     * @param {Object} opts.topBitOpts
     * @param {string} opts.bottomBit
     * @param {Object} opts.bottomBitOpts
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.routedShapes
     */
    const routedCylinderElliptic = (opts) => {
        const initOpts = modelCylinderEllipticOpts(opts)
        const modelProperties = modelProps(initOpts)

        const {
            topBit: topBitType,
            bottomBit: bottomBitType,
        } = modelProperties.opts

        const {
            height,
            radius,
            topBit,
            bottomBit,
        } = modelProperties.dims

        const baseShape = cylinderElliptic({
            height,
            startRadius: radius,
            endRadius: radius,
        })
        const baseShapeProfile = project({}, baseShape)
        const baseShapeProfileOutlinePts = toOutlines(baseShapeProfile)[0]

        const cutPathTop = routerCut(baseShapeProfileOutlinePts, topBitType, topBit)
        const cutPathBottom = routerCut(baseShapeProfileOutlinePts, bottomBitType, bottomBit)

        let cutShape = baseShape
        const hasTop = !!topBitType && topBitType != 'none'
        const hasBottom = !!bottomBitType && bottomBitType != 'none'

        if (hasTop) {
            cutShape = subtract(
                cutShape,
                translate([0, 0, height / 2], cutPathTop),
            )
        }
        if (hasBottom) {
            cutShape = subtract(
                cutShape,
                translate([0, 0, height / -2], cutPathBottom),
            )
        }

        const mainModel = cutShape
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Modelling functions that generate 3D geometries which have been "routed" with bits from `components.beadsBits.corner`.
     * @namespace routedShapes
     * @memberof components
     */
    const routedShapes = {
        routedCuboid,
        routedCylinderElliptic,
    }

    return routedShapes
}

module.exports = {
    init: routedShapesInit
}
