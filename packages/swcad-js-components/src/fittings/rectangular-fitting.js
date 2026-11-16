"use strict"

const rectangularFittingInit = ({ jscad, swcadJs }) => {
    const {
        rectangle,
        cuboid,
    } = jscad.primitives

    const {
        align,
        rotate,
    } = jscad.transforms

    const {
        subtract,
        union,
        intersect,
    } = jscad.booleans

    const {
        extrudeLinear,
    } = jscad.extrusions

    const { TAU } = jscad.maths.constants

    const {
        standards,
    } = swcadJs.data

    const {
        math,
        position,
    } = swcadJs.calcs

    const {
        connections,
    } = swcadJs.profiles


    //==============================================================================


    /**
     * Builds default values and opts for the model
     * @param {*} opts 
     * @returns default values and opts
     * @memberof components.fittings
     * @access private
     */
    const rectangularFittingDefaults = () => {
        const defaultValues = {
            constants: {},
            opts: {},
            dims: {
                subjectSize: [10, 2],
                length: math.inchesToMm(1 / 4),
            },
            points: {},
            components: {},
        }

        const defaultOpts = {
            interfaceThickness: standards.INTERFACE_THICKNESS,
            fitGap: standards.FIT_GAP,
            subjectSize: defaultValues.dims.subjectSize,
            length: defaultValues.dims.length,
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
     * @memberof components.fittings
     * @access private
     */
    const rectangularFittingOpts = (opts) => {
        const defaults = rectangularFittingDefaults()

        // User options
        const {
            subjectSize = defaults.opts.subjectSize,
            length = defaults.opts.length,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
        } = opts

        const stdOpts = {
            interfaceThickness,
            fitGap,
        }

        const initOpts = {
            subjectSize,
            length,
            ...stdOpts,
        }


        return initOpts
    }


    //------------------------------------------------------------------------------


    /**
     * Builds model properties from the given opts
     * @param {*} opts 
     * @returns model properties
     * @memberof components.fittings
     * @access private
     */
    const rectangularFittingProps = (opts) => {
        const defaults = rectangularFittingDefaults()

        const {
            subjectSize,
            length,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const subjectWidth = subjectSize[0]
        const subjectHeight = subjectSize[1]

        const width = subjectWidth + (interfaceThickness * 2)
        const height = subjectHeight / 3 + interfaceThickness

        const cutProfileWidth = subjectWidth + fitGap
        const cutProfileHeight = subjectHeight + fitGap

        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Constant values for model */
        const modelConstants = defaults.vals.constants

        /** Derived user options for the model */
        const modelOpts = defaults.vals.opts

        /** Various dimensions for model */
        const modelDims = {
            subjectSize,
            subjectWidth,
            subjectHeight,
            length,
            width,
            height,
            cutProfileWidth,
            cutProfileHeight,
            interfaceThickness,
            fitGap,
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


    //------------------------------------------------------------------------------

    /* ----------------------------------------
    * MODELLING FUNCTIONS
    * ------------------------------------- */

    /**
     * Generates a 2D cutaway profile for square/rectangular fittings.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number[]} opts.subjectSize
     * @param {number} opts.length
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof components.fittings
     */
    const rectFittingCutProfile = (opts) => {
        const initOpts = rectangularFittingOpts(opts)
        const modelProperties = rectangularFittingProps(initOpts)

        const {
            cutProfileWidth,
            cutProfileHeight,
        } = modelProperties.dims

        const mainModel = rectangle({
            size: [
                cutProfileWidth,
                cutProfileHeight,
            ]
        })
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a fitting for square/rectangular dowels.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number[]} opts.subjectSize - size of subject cross section (length, width)
     * @param {number} opts.length - length of fitting
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof components.fittings
     */
    const rectangularFitting = (opts) => {
        const initOpts = rectangularFittingOpts(opts)
        const modelProperties = rectangularFittingProps(initOpts)

        const {
            length,
            width,
            height,
            interfaceThickness,
        } = modelProperties.dims

        const baseRect = rectangle({
            size: [width, height]
        })

        const topCutaway = rectFittingCutProfile(opts)[0]

        const dHolderSection = subtract(
            align({
                modes: ['center', 'min', 'center'],
                relativeTo: [0, -interfaceThickness, 0]
            }, baseRect),
            align({ modes: ['center', 'min', 'center'] }, topCutaway),
        )

        let dHolder = extrudeLinear({ height: length }, dHolderSection)
        dHolder = rotate([Math.PI / 2, 0, 0], dHolder)

        const mainModel = position.ctr(dHolder)
        const modelParts = {
            mainModel,
            section: dHolderSection,
            cutaway: topCutaway,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a "cross" rectangular fitting.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number[]} opts.subjectSize - size of subject cross section (length, width)
     * @param {number} opts.length - length of fitting
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof components.fittings
     */
    const rectangularFittingCross = (opts) => {
        const initOpts = rectangularFittingOpts(opts)
        const modelProperties = rectangularFittingProps(initOpts)

        const {
            interfaceThickness,
            length,
            width,
            height,
        } = modelProperties.dims

        const totalLength = length * 2

        const blankBase = cuboid({ size: [totalLength, width, height] })
        const cutawayProfile = rectFittingCutProfile(opts)[0]
        let cutawayBase = extrudeLinear({ height: totalLength * 1.5 }, cutawayProfile)
        cutawayBase = position.ctr(rotate([TAU / 4, 0, 0], cutawayBase))

        const blank = union(
            blankBase,
            rotate([0, 0, TAU / 4], blankBase),
        )

        const cutaway = union(
            cutawayBase,
            rotate([0, 0, TAU / 4], cutawayBase),
        )

        const rectangularFittingCrossAssembly = subtract(
            position.ctrMin(blank, [0, 0, -interfaceThickness]),
            position.ctrMin(cutaway),
        )

        const mainModel = position.ctr(rectangularFittingCrossAssembly)
        const modelParts = {
            mainModel,
            blankBase,
            cutawayProfile,
            cutawayBase,
            blank,
            cutaway,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a "T" rectangular fitting.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number[]} opts.subjectSize - size of subject cross section (length, width)
     * @param {number} opts.length - length of fitting
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof components.fittings
     */
    const rectangularFittingTee = (opts) => {
        const initOpts = rectangularFittingOpts(opts)
        const modelProperties = rectangularFittingProps(initOpts)

        const {
            interfaceThickness,
            length,
            width,
            height,
            fitGap,
        } = modelProperties.dims

        const totalLength = length * 2

        const blankBase = cuboid({ size: [totalLength, width, height] })
        const blankBaseTee = align(
            { modes: ['min', 'center', 'center'] },
            cuboid({ size: [length, width, height] })
        )

        const cutawayProfile = rectFittingCutProfile(opts)[0]

        let cutawayBase = extrudeLinear({ height: totalLength * 1.5 }, cutawayProfile)
        cutawayBase = position.ctr(rotate([TAU / 4, 0, 0], cutawayBase))

        let cutawayBaseTee = extrudeLinear({ height: length * 1.5 }, cutawayProfile)
        cutawayBaseTee = align(
            { modes: ['center', 'min', 'center'] },
            rotate([TAU / 4, 0, 0], cutawayBaseTee)
        )

        const blank = union(
            blankBase,
            rotate([0, 0, TAU / 4], blankBaseTee),
        )

        const cutaway = union(
            rotate([0, 0, TAU / 4], cutawayBase),
            cutawayBaseTee,
        )

        const blankOffsetY = fitGap / 2 - interfaceThickness
        const rectangularFittingTeeAssembly = subtract(
            align({
                modes: ['center', 'min', 'min'],
                relativeTo: [0, blankOffsetY, -interfaceThickness],
            }, blank),
            align({
                modes: ['center', 'min', 'min'],
            }, cutaway),
        )

        const mainModel = position.ctr(rectangularFittingTeeAssembly)
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a split rectangular fitting. Returns two models (male + female).
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number[]} opts.subjectSize - size of subject cross section (length, width)
     * @param {number} opts.length - length of fitting
     * @returns {Array.<(geom3|Object.<string, geom3>|Object.<string, any>)>} Array with model, parts, and properties
     * @memberof components.fittings
     */
    const rectangularFittingSplit = (opts) => {
        const initOpts = rectangularFittingOpts(opts)
        const modelProperties = rectangularFittingProps(initOpts)

        const {
            subjectWidth,
            interfaceThickness,
            length,
            width,
            height,
        } = modelProperties.dims

        const ellipseTabRadius = subjectWidth / 2
        const connLength = interfaceThickness * 2 + ellipseTabRadius
        const fittingBodyLength = (length - connLength) / 2

        const splitProfiles = connections.tab.ellipse({
            size: [width, connLength],
            interfaceMargin: [interfaceThickness, interfaceThickness],
            segments: 12,
        })[0]
        const [maleSplitProfile, femaleSplitProfile] = splitProfiles
        const fittingBodyProfile = rectangle({ size: [width, fittingBodyLength] })

        const maleFittingProfile = union(
            align({ modes: ['center', 'min', 'center'] }, maleSplitProfile),
            align({ modes: ['center', 'max', 'center'] }, fittingBodyProfile),
        )
        const femaleFittingProfile = union(
            align({ modes: ['center', 'max', 'center'] }, femaleSplitProfile),
            align({ modes: ['center', 'min', 'center'] }, fittingBodyProfile),
        )

        const maleFittingZone = extrudeLinear({ height: height }, maleFittingProfile)
        const femaleFittingZone = extrudeLinear({ height: height }, femaleFittingProfile)
        const baseFitting = rectangularFitting(opts)[0]

        const maleRoundFitting = intersect(
            position.ctrMin(maleFittingZone),
            position.ctrMin(baseFitting),
        )
        const femaleRoundFitting = intersect(
            position.ctrMin(femaleFittingZone),
            position.ctrMin(baseFitting),
        )

        const mainModel = [
            position.ctr(maleRoundFitting),
            position.ctr(femaleRoundFitting),
        ]

        const modelParts = {
            mainModel,
            maleSplitProfile,
            femaleSplitProfile,
            maleFittingProfile,
            femaleFittingProfile,
            maleFitting: maleRoundFitting,
            femaleFitting: femaleRoundFitting,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: rectangularFittingDefaults,
        props: rectangularFittingProps,
        rectFittingCutProfile,
        rectangularFitting,
        rectangularFittingCross,
        rectangularFittingTee,
        rectangularFittingSplit,
    }
}

module.exports = {
    init: rectangularFittingInit
}
