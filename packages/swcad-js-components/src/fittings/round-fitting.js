"use strict"

const roundFittingInit = ({ jscad, swcadJs }) => {
    const {
        circle,
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
        subtract,
    } = jscad.booleans

    const {
        extrudeLinear,
    } = jscad.extrusions

    const {
        constants,
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
     * @memberof components.fittings
     * @access private
     */
    const roundFittingDefaults = () => {
        const defaultValues = {
            constants: {
                ratioDiamToHolderHeight: 1.666667,
                ratioDiamToChannelDepth: 0.866667,
                ratioDiamToSideChannelWidth: 1,
                ratioDiamToDowelDepth: 0.333333,
                ratioDiamToDoubleFittingMaxHt: 2.973,
                ratioDiamToDblFittingVertDowelCtrsDist: 1.973,
                ratioDiamToDblFittingSideDowelCtrsDist: 1.798,
            },
            opts: {},
            dims: {
                dowelRadius: 3.25 / 2,
                length: math.inchesToMm(1 / 4),
            },
            points: {},
            components: {},
        }

        const defaultOpts = {
            interfaceThickness: 1.333333,
            fitGap: math.inchesToMm(1 / 128),
            dowelRadius: defaultValues.dims.dowelRadius,
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
    const roundFittingOpts = (opts) => {
        const defaults = roundFittingDefaults()

        // User options
        const {
            dowelRadius = defaults.opts.dowelRadius,
            length = defaults.opts.length,
            interfaceThickness = defaults.opts.interfaceThickness,
            fitGap = defaults.opts.fitGap,
        } = opts

        const stdOpts = {
            interfaceThickness,
            fitGap,
        }

        const initOpts = {
            dowelRadius,
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
    const roundFittingProps = (opts) => {
        const defaults = roundFittingDefaults()

        const {
            dowelRadius,
            length,
            interfaceThickness,
            fitGap,
        } = opts

        /* ----------------------------------------
        * Prop calculations
        * ------------------------------------- */

        const dowelDiam = dowelRadius * 2
        const width = interfaceThickness * 2 + dowelDiam

        const roundCutProfileRadius = fitGap / 2 + dowelRadius
        const invCutProfileSideLength = dowelDiam + fitGap
        const invCutProfileHeight = dowelDiam * constants.EQUI_TRIANGLE_HEIGHT_FACTOR

        const simpleHeight = dowelDiam / 3 + interfaceThickness + fitGap
        const invSimpleHeight = invCutProfileHeight + interfaceThickness + fitGap


        /* ----------------------------------------
        * Preparing Model Properties, Dimensions
        * ------------------------------------- */

        /** Derived user options for the model */
        const modelOpts = defaults.vals.opts
        /** Various dimensions for model */
        const modelDims = {
            dowelRadius,
            dowelDiam,
            width,
            invCutProfileHeight,
            invCutProfileSideLength,
            roundCutProfileRadius,
            simpleHeight,
            invSimpleHeight,
            length,
            interfaceThickness,
            fitGap,
        }

        /** Various key points for model */
        const modelPoints = defaults.vals.points

        const modelConstants = defaults.vals.constants

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

    /**
     * Generates a 2D cutaway profile for round fittings.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.dowelRadius
     * @param {number} opts.length
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.fittings
     */
    const roundFittingCutProfile = (opts) => {
        const initOpts = roundFittingOpts(opts)
        const modelProperties = roundFittingProps(initOpts)

        const {
            roundCutProfileRadius,
        } = modelProperties.dims

        const mainModel = circle({ radius: roundCutProfileRadius })
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a 2D cutaway profile for inverted round fittings.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.dowelRadius
     * @param {number} opts.length
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.fittings
     */
    const invRoundFittingCutProfile = (opts) => {
        const initOpts = roundFittingOpts(opts)
        const modelProperties = roundFittingProps(initOpts)

        const {
            invCutProfileSideLength,
        } = modelProperties.dims

        const mainModel = triangle({
            type: 'SSS', values: [
                invCutProfileSideLength,
                invCutProfileSideLength,
                invCutProfileSideLength
            ]
        })
        const modelParts = {
            mainModel,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a fitting for dowels (round groove).
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.dowelRadius
     * @param {number} opts.length
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.fittings
     */
    const roundFitting = (opts) => {
        const initOpts = roundFittingOpts(opts)
        const modelProperties = roundFittingProps(initOpts)

        const {
            interfaceThickness,
            length,
            width,
            simpleHeight,
        } = modelProperties.dims

        const baseRect = rectangle({
            size: [width, simpleHeight]
        })

        const topCutaway = roundFittingCutProfile(opts)[0]

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
     * Generates a fitting for dowels, inverted for 3D-printing from the bottom (triangular groove).
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.dowelRadius
     * @param {number} opts.length
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.fittings
     */
    const inverseRoundFitting = (opts) => {
        const initOpts = roundFittingOpts(opts)
        const modelProperties = roundFittingProps(initOpts)

        const {
            length,
            width,
            invSimpleHeight,
        } = modelProperties.dims

        const baseRect = rectangle({
            size: [width, invSimpleHeight]
        })

        const channelCutaway = invRoundFittingCutProfile(opts)[0]

        const dHolderSection = subtract(
            align({ modes: ['center', 'min', 'center'] }, baseRect),
            align({ modes: ['center', 'min', 'center'] }, channelCutaway),
        )

        let dHolder = extrudeLinear({ height: length }, dHolderSection)
        dHolder = rotate([Math.PI / 2, 0, 0], dHolder)

        const mainModel = position.ctr(dHolder)
        const modelParts = {
            mainModel,
            section: dHolderSection,
            cutaway: channelCutaway,
        }

        return [mainModel, modelParts, modelProperties]
    }

    /**
     * Generates a fitting that accomodates 2 round dowels, plus space for 2 side dowels.
     * @param {Object} opts - Options for the model
     * @param {number} opts.interfaceThickness - Thickness of the interface connections
     * @param {number} opts.fitGap - Gap for fitting parts together
     * @param {number} opts.dowelRadius
     * @param {number} opts.length
     * @returns Array with model, parts, and properties: [`geom3`, `Object.<string, geom3>`, `Object.<string, any>`]
     * @memberof components.fittings
     */
    const doubleRoundFitting = (opts) => {
        const initOpts = roundFittingOpts(opts)
        const modelProperties = roundFittingProps(initOpts)

        const {
            ratioDiamToHolderHeight,
            ratioDiamToSideChannelWidth,
        } = modelProperties.constants

        const {
            dowelRadius,
            dowelDiam,
            width,
            length,
        } = modelProperties.dims

        const baseRect = rectangle({
            size: [
                width,
                dowelDiam * ratioDiamToHolderHeight,
            ]
        })

        const topCutaway = roundFittingCutProfile(opts)[0]
        const channelCutaway = invRoundFittingCutProfile(opts)[0]
        const sideCutaway = triangle({
            type: 'ASA', values: [
                Math.PI / 6,
                dowelDiam * ratioDiamToSideChannelWidth,
                Math.PI / 6,
            ]
        })

        let sideCutaway1 = sideCutaway
        sideCutaway1 = rotate([0, 0, Math.PI / -2], sideCutaway1)
        const sideCutaway2 = mirror({ normal: [1, 0, 0] }, sideCutaway1)

        let dHolderSection = subtract(
            align({ modes: ['center', 'min', 'center'] }, baseRect),
            align({ modes: ['center', 'min', 'center'] }, channelCutaway),
        )

        dHolderSection = subtract(
            align({ modes: ['center', 'max', 'center'] }, dHolderSection),
            translate([0, dowelRadius / 3, 0], topCutaway),
        )

        dHolderSection = subtract(
            align({ modes: ['min', 'center', 'center'] }, dHolderSection),
            align({ modes: ['min', 'center', 'center'] }, sideCutaway1),
        )

        dHolderSection = subtract(
            align({ modes: ['max', 'center', 'center'] }, dHolderSection),
            align({ modes: ['max', 'center', 'center'] }, sideCutaway2),
        )

        /* ----------------------------------------
         * Outputs
         * ------------------------------------- */

        const dowelHolderSection = position.ctr(dHolderSection)

        let dHolder = extrudeLinear({ height: length }, dowelHolderSection)
        dHolder = rotate([Math.PI / 2, 0, 0], dHolder)

        const mainModel = position.ctr(dHolder)

        const modelParts = {
            mainModel,
            topCutaway,
            sideCutaway,
            bottomCutaway: channelCutaway,
            section: dowelHolderSection,
        }

        return [mainModel, modelParts, modelProperties]
    }

    return {
        defaults: roundFittingDefaults,
        props: roundFittingProps,
        roundFittingCutProfile,
        invRoundFittingCutProfile,
        roundFitting,
        inverseRoundFitting,
        doubleRoundFitting,
    }
}

module.exports = {
    init: roundFittingInit
}
