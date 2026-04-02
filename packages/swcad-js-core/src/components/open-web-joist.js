/**
 * @file Salvador Workshop's JSCAD Model Template (v3.3.1)
 * @module openWebJoist
 * @author R. J. Salvador (Salvador Workshop)
 * @version 0.0.1
 */

"use strict"

const openWebJoistInit = ({ lib, swJscad }) => {
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
    } = lib.primitives

    const {
        align,
        translate,
        rotate,
        mirror
    } = lib.transforms

    const {
        intersect,
        subtract,
        union,
        scission
    } = lib.booleans

    const {
        extrudeLinear,
        extrudeRotate,
        project
    } = lib.extrusions

    const {
        measureDimensions,
        measureBoundingBox,
        measureVolume
    } = lib.measurements

    const {
        hull,
        hullChain
    } = lib.hulls

    const { vectorText } = lib.text
    const { toOutlines } = lib.geometries.geom2
    const { TAU } = lib.maths.constants
    const { colorize } = lib.colors

    const beadsBits = require('./beads-bits').init({ lib, swJscad });

    const {
        math
    } = swJscad.utils

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
            }
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            size: defaultValues.dims.size,
            type: 'default',
            scale: 1,
            interfaceThickness: 1.333333,
            fitGap: math.inchesToMm(1 / 128),
            logMode: 'normal',
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
        console.log('panelFrameProps() -- opts', opts)

        const {
            size,
            type,
            scale,
            interfaceThickness,
            fitGap,
            logMode,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const width = size[0]
        const depth = size[1]
        const height = size[2]

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
        }

        /** Various dimensions for model */
        const modelDims = {
            size,
            interfaceThickness,
            fitGap,
            width,
            depth,
            height,
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

        console.log('panelFrameProps() -- modelProperties', modelProperties)

        return modelProperties
    }


    //------------------------------------------------------------------------------


    /**
     * New Model
     * @param {*} opts 
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof openWebJoist
     */
    const model = (opts) => {
        const defaults = modelDefaults()

        // User options
        const {
            size = defaults.opts.size,
            type = defaults.opts.type,
            scale = defaults.opts.scale,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
            logMode = defaults.opts.logMode,
        } = opts

        console.log('newModel() -- opts', opts)
        const inOpts = {
            size,
            type,
            scale,
            interfaceThickness,
            fitGap,
            logMode,
        }

        const modelProperties = modelProps(inOpts)

        /* ----------------------------------------
         * Modelling, Component/Assembly Modules
         * ------------------------------------- */

        /** Sub-component 01 */
        const subcomponent1 = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            return sphere()
        }

        /** Sub-component 02 */
        const subcomponent2 = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            return cube()
        }

        /** Assembly 01 */
        const assembly1 = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            return sphere()
        }

        /** Assembly 02 */
        const assembly2 = (modelProps) => {
            const {
                metadata,
                opts,
                dims,
                points,
            } = modelProps

            return cube()
        }

        /* ----------------------------------------
         * Complete Assembly
         * ------------------------------------- */

        /** Final Assembly */
        const finalAssembly = (modelProps) => {
            let subComp1 = subcomponent1(modelProps)
            let subComp2 = subcomponent2(modelProps)

            let a1 = assembly1(modelProps)
            let a2 = assembly2(modelProps)

            return union(
                subComp1,
                subComp2,
            )
        }

        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */

        let subComp1 = subcomponent1(modelProperties)
        let subComp2 = subcomponent2(modelProperties)

        let a1 = assembly1(modelProperties)
        let a2 = assembly2(modelProperties)

        let mainModel = finalAssembly(modelProperties)

        let modelParts = {
            subcomponent1: subComp1,
            subcomponent2: subComp2,
            assembly1: a1,
            assembly2: a2,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return model
}


//==============================================================================




/* ----------------------------------------
 * Test subjects
 * ------------------------------------- */

const newModelOpts = {
    size: [25.4 * 3, 25.4 * 3, 25.4 * 1],
}

const newModelData = model(newModelOpts)

const newModelMain = newModelData[0]
const newModelParts = newModelData[1]
const newModelProps = newModelData[2]

console.log('newModelProps', newModelProps)




//==============================================================================




/**
 * Main function to be rendered by JSCAD
 * @returns `geom3` or `geom3[]`
 */
function main() {
    const spaceUnit = 25.4 * 3.5

    return [
        translate([spaceUnit * 0, spaceUnit * 0, spaceUnit * 0], newModelMain),

        translate([spaceUnit * 1, spaceUnit * 0, spaceUnit * 0], newModelParts.subcomponent1),
        translate([spaceUnit * 1, spaceUnit * 1, spaceUnit * 0], newModelParts.subcomponent2),

        translate([spaceUnit * 1, spaceUnit * 2, spaceUnit * 0], newModelParts.assembly1),
        translate([spaceUnit * 1, spaceUnit * 3, spaceUnit * 0], newModelParts.assembly2),
    ]
}


module.exports = {
    init: openWebJoistInit,
    main,
}
