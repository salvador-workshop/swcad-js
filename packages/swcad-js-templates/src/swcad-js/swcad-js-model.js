"use strict"

const jscad = require('@jscad/modeling')

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

const swcadJs = require('swcad-js').init({ jscad });

const {
    standards,
} = swcadJs.data

const {
    math,
} = swcadJs.calcs


//==============================================================================


/**
 * Builds default values and opts for the model
 * @param {*} opts 
 * @returns default values and opts
 * @memberof newModelName
 * @access private
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
            centrePt: [0, 0, 0]
        },
        types: {
            default: standards.types.TYPE_DEFAULT,
            alt: standards.types.TYPE_ALT,
        },
    }

    /** Options used by SW models */
    const standardOpts = {
        type: defaultValues.types.default.id,
        scale: 1,
        interfaceThickness: standards.INTERFACE_THICKNESS,
        fitGap: standards.FIT_GAP,
    }

    /** Computed values for option defaults */
    const defaultOpts = {
        ...standardOpts,
        size: defaultValues.dims.size,
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
 * @memberof newModelName
 * @access private
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
    } = opts

    const stdOpts = {
        type,
        scale,
        interfaceThickness,
        fitGap,
    }

    const initOpts = {
        size,
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
 * @memberof newModelName
 * @access private
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
    } = opts

    /* ----------------------------------------
    * Prop calculations
    * ------------------------------------- */

    const width = size[0]
    const depth = size[1]
    const height = size[2]

    /* ----------------------------------------
    * Preparing Model Properties, Dimensions
    * ------------------------------------- */

    /** Constant values for model */
    const modelConstants = {
    }

    /** Derived user options for the model */
    const modelOpts = {
        type,
        scale,
    }

    /** Various dimensions for model */
    const modelDims = {
        size,
        width,
        depth,
        height,
        interfaceThickness,
        fitGap,
    }

    /** Various key points for model */
    const modelPoints = {
        centrePt: defaults.vals.points.centrePt,
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

    console.log('modelProps() -- modelProperties', modelProperties)

    return modelProperties
}


//------------------------------------------------------------------------------


/**
 * New Model
 * @param {*} opts 
 * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
 * @memberof newModelParent
 */
const model = (opts) => {
    const defaults = modelDefaults()
    const initOpts = modelOpts(opts)
    const modelProperties = modelProps(initOpts)

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

    /* ----------------------------------------
     * Complete Assembly
     * ------------------------------------- */

    /** Final Assembly */
    const finalAssembly = (modelProps) => {
        let subComp1 = subcomponent1(modelProps)
        let subComp2 = subcomponent2(modelProps)

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

    let mainModel = finalAssembly(modelProperties)

    let modelParts = {
        subcomponent1: subComp1,
        subcomponent2: subComp2,
    }

    return [mainModel, modelParts, modelProperties]
}


//------------------------------------------------------------------------------


/* ----------------------------------------
 * Model / Scene Prep
 * ------------------------------------- */


const outer = subtract(
    cube({ size: 10 }),
    sphere({ radius: 6.8 })
)

const inner = intersect(
    sphere({ radius: 4 }),
    cube({ size: 7 })
)


//==============================================================================


/**
 * Main function to be rendered by JSCAD
 * @returns `geom3` or `geom3[]`
 */
function main() {
    const spaceUnit = math.inchesToMm(3.5)

    return [
        translate([spaceUnit * 0, spaceUnit * 0, spaceUnit * 0], inner),
        translate([spaceUnit * 0, spaceUnit * 0, spaceUnit * 0], outer),
    ]
}


module.exports = {
    modelDefaults,
    modelProps,
    model,
    main,
}
