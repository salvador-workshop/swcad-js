"use strict"

/**
 * ...
 * @memberof profiles.trim
 * @namespace aranea
 */

const trimAranea = ({ jscad, swcadJs }) => {
    const { polygon, square } = jscad.primitives
    const { subtract, union } = jscad.booleans
    const { rotate, translate, mirror, center } = jscad.transforms

    const { constants } = swcadJs.data


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
            constants: {
                numLevels: 3,
            },
            dims: {
                size: [
                    math.inchesToMm(1.5),
                    math.inchesToMm(0.75),
                ],
                detailDepth: math.inchesToMm(0.75) / 3,
            },
            points: {
                centre: [0, 0, 0]
            },
            types: {
                dado: { id: 'dado', desc: 'Dado Trim' },
                base: { id: 'base', desc: 'Base Trim' },
                crown: { id: 'crown', desc: 'Crown Trim' },
            },
        }

        /** Options used by SW models */
        const standardOpts = {
            type: defaultValues.types.dado.id,
            scale: 1,
            interfaceThickness: 1.333333,
            fitGap: math.inchesToMm(1 / 128),
        }

        /** Computed values for option defaults */
        const defaultOpts = {
            ...standardOpts,
            size: defaultValues.dims.size,
            detailDepth: defaultValues.dims.detailDepth,
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
            detailDepth = defaults.opts.detailDepth,
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
            detailDepth,
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
            detailDepth,
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

        const numLevels = defaults.vals.constants.numLevels;
        const dDepth = detailDepth || depth / 3;
        const levelPoints = {};
        const ornamentPoints = {};
        const thicknessPoints = {};

        for (let levelIdx = 0; levelIdx <= numLevels; levelIdx++) {
            levelPoints[`l${levelIdx}`] = width * levelIdx;
            thicknessPoints[`t${levelIdx}`] = depth * levelIdx;
            ornamentPoints[`o${levelIdx + 1}`] = width * levelIdx + (width * constants.PHI_INV);
        }
        levelPoints[`lHalf`] = width / 2;

        const controlPoints = {};

        const getPointsForLevel = (levelPt) => {
            const lPoints = {};
            for (const [tPtName, tPtValue] of Object.entries(thicknessPoints)) {
                lPoints[tPtName] = [tPtValue, levelPt];
            }
            return lPoints;
        }

        for (const [ptName, ptValue] of Object.entries(levelPoints)) {
            controlPoints[ptName] = getPointsForLevel(ptValue);
        }
        for (const [ptName, ptValue] of Object.entries(ornamentPoints)) {
            controlPoints[ptName] = getPointsForLevel(ptValue);
        }

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
            detailDepth,
            interfaceThickness,
            fitGap,
            width,
            depth,
        }

        /** Various key points for model */
        const modelPoints = {
            centre: defaults.vals.points.centre,
            controlPts: controlPoints,
            levelPts: levelPoints,
            ornamentPts: ornamentPoints,
            thicknessPts: thicknessPoints,
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

    /**
     * Creates a set of trimwork profiles
     * @param {Object} opts 
     * @param {number} opts.size - Typical size for basic trim unit (`[width, depth]`)
     * @param {number} opts.detailDepth - Size of corner details (mm). Defaults to 1/3 of `size[1]`
     * @param {number} opts.type - Style options ("base", "crown", "dado"). Defaults to "dado"
     * @memberof profiles.trim.aranea
     * @instance
     */
    const trimFamilyAranea = (opts) => {
        const defaults = modelDefaults()
        const initOpts = modelOpts(opts)
        const modelProperties = modelProps(initOpts)

        const detailCorner = ({ sideLength }) => {
            const baseSquare = square({ size: Math.hypot(sideLength, sideLength) });

            return rotate([0, 0, Math.PI / 4], baseSquare);
        }

        /* ----------------------------------------
         * Modelling, Component/Assembly Modules
         * ------------------------------------- */

        const extraSmall = (mProperties) => {
            const {
                size,
                width,
                depth,
                detailDepth,
            } = mProperties.dims

            const {
                type,
            } = mProperties.opts

            const {
                controlPts,
                levelPts,
                ornamentPts,
                thicknessPts,
            } = mProperties.points

            const cornerPt1 = controlPoints.l0.t1;
            const cornerPt2 = controlPoints.lHalf.t1;
            const baseShape = polygon({
                points: [
                    controlPoints.l0.t0,
                    cornerPt1,
                    cornerPt2,
                    controlPoints.lHalf.t0,
                ]
            });
            const baseCorner = detailCorner({ sideLength: detailDepth });
            const corner1 = translate([...cornerPt1, 0], baseCorner);
            const corner2 = translate([...cornerPt2, 0], baseCorner);

            let cutShape = subtract(baseShape, corner1);
            if (!['crown', 'base'].includes(styleOpts)) {
                cutShape = subtract(cutShape, corner2);
            }

            return cutShape;
        }

        const small = (mProperties) => {
            const {
                size,
                width,
                depth,
                detailDepth,
            } = mProperties.dims

            const {
                type,
            } = mProperties.opts

            const {
                controlPts,
                levelPts,
                ornamentPts,
                thicknessPts,
            } = mProperties.points

            const cornerPt1 = controlPoints.l0.t1;
            const cornerPt2 = controlPoints.l1.t1;
            const baseShape = polygon({
                points: [
                    controlPoints.l0.t0,
                    cornerPt1,
                    cornerPt2,
                    controlPoints.l1.t0,
                ]
            });
            const baseCorner = detailCorner({ sideLength: detailDepth });
            const corner1 = translate([...cornerPt1, 0], baseCorner);
            const corner2 = translate([...cornerPt2, 0], baseCorner);

            let cutShape = subtract(baseShape, corner1);
            if (!['crown', 'base'].includes(styleOpts)) {
                cutShape = subtract(cutShape, corner2);
            }

            return cutShape;
        }

        const smallOrnament1 = (mProperties) => {
            const {
                size,
                width,
                depth,
                detailDepth,
            } = mProperties.dims

            const {
                type,
            } = mProperties.opts

            const {
                controlPts,
                levelPts,
                ornamentPts,
                thicknessPts,
            } = mProperties.points

            const baseShape = small({ controlPoints, detailDepth, styleOpts });

            const oPt = controlPoints.o1.t1;
            const bCorner = detailCorner({ sideLength: detailDepth * constants.PHI_INV });
            const oCorner = translate([...oPt, 0], bCorner);

            return subtract(baseShape, oCorner);
        }

        const medium = (mProperties) => {
            const {
                size,
                width,
                depth,
                detailDepth,
            } = mProperties.dims

            const {
                type,
            } = mProperties.opts

            const {
                controlPts,
                levelPts,
                ornamentPts,
                thicknessPts,
            } = mProperties.points

            const cornerPt1 = controlPoints.l0.t1;
            const cornerPt2 = controlPoints.l1.t1;
            const cornerPt3 = controlPoints.l1.t2;
            const cornerPt4 = controlPoints.l2.t2;

            const baseShape = polygon({
                points: [
                    controlPoints.l0.t0,
                    cornerPt1,
                    cornerPt2,
                    cornerPt3,
                    cornerPt4,
                    controlPoints.l2.t0,
                ]
            })

            const baseCorner = detailCorner({ sideLength: detailDepth });
            const corner1 = translate([...cornerPt1, 0], baseCorner);
            const corner2 = translate([...cornerPt2, 0], baseCorner);
            const corner3 = translate([...cornerPt3, 0], baseCorner);
            const corner4 = translate([...cornerPt4, 0], baseCorner);

            let cutShape = subtract(baseShape, corner1);
            cutShape = union(cutShape, corner2);
            cutShape = subtract(cutShape, corner3);
            if (!['crown', 'base'].includes(styleOpts)) {
                cutShape = subtract(cutShape, corner4);
            }

            return cutShape;
        }

        const mediumOrnament1 = (mProperties) => {
            const {
                size,
                width,
                depth,
                detailDepth,
            } = mProperties.dims

            const {
                type,
            } = mProperties.opts

            const {
                controlPts,
                levelPts,
                ornamentPts,
                thicknessPts,
            } = mProperties.points

            const baseShape = medium({ controlPoints, detailDepth, styleOpts });

            const oPt1 = controlPoints.o2.t2;
            const oPt2 = controlPoints.o1.t1;

            const bCorner = detailCorner({ sideLength: detailDepth * constants.PHI_INV });
            const oCorner1 = translate([...oPt1, 0], bCorner);
            let oCorner2 = translate([...oPt2, 0], bCorner);
            oCorner2 = mirror({ origin: [0, controlPoints.l1.t1[1] / 2, 0], normal: [0, 1, 0] }, oCorner2);

            let cutShape = subtract(baseShape, oCorner1);
            cutShape = subtract(cutShape, oCorner2);

            return cutShape;
        }

        const large = (mProperties) => {
            const {
                size,
                width,
                depth,
                detailDepth,
            } = mProperties.dims

            const {
                type,
            } = mProperties.opts

            const {
                controlPts,
                levelPts,
                ornamentPts,
                thicknessPts,
            } = mProperties.points

            const cornerPt1 = controlPoints.l0.t1;
            const cornerPt2 = controlPoints.l1.t1;
            const cornerPt3 = controlPoints.l1.t2;
            const cornerPt4 = controlPoints.l2.t2;
            const cornerPt5 = controlPoints.l2.t3;
            const cornerPt6 = controlPoints.l3.t3;

            const baseShape = polygon({
                points: [
                    controlPoints.l0.t0,
                    cornerPt1,
                    cornerPt2,
                    cornerPt3,
                    cornerPt4,
                    cornerPt5,
                    cornerPt6,
                    controlPoints.l3.t0,
                ]
            })

            const baseCorner = detailCorner({ sideLength: detailDepth });
            const corner1 = translate([...cornerPt1, 0], baseCorner);
            const corner2 = translate([...cornerPt2, 0], baseCorner);
            const corner3 = translate([...cornerPt3, 0], baseCorner);
            const corner4 = translate([...cornerPt4, 0], baseCorner);
            const corner5 = translate([...cornerPt5, 0], baseCorner);
            const corner6 = translate([...cornerPt6, 0], baseCorner);

            let cutShape = subtract(baseShape, corner1);
            cutShape = union(cutShape, corner2);
            cutShape = subtract(cutShape, corner3);
            cutShape = union(cutShape, corner4);
            cutShape = subtract(cutShape, corner5);
            if (!['crown', 'base'].includes(styleOpts)) {
                cutShape = subtract(cutShape, corner6);
            }

            return cutShape;
        }

        const largeOrnament1 = (mProperties) => {
            const {
                size,
                width,
                depth,
                detailDepth,
            } = mProperties.dims

            const {
                type,
            } = mProperties.opts

            const {
                controlPts,
                levelPts,
                ornamentPts,
                thicknessPts,
            } = mProperties.points

            const baseShape = large({ controlPoints, detailDepth, styleOpts });

            const oPt1 = controlPoints.o3.t3;
            const oPt2 = controlPoints.o1.t1;

            const bCorner = detailCorner({ sideLength: detailDepth * constants.PHI_INV });
            const oCorner1 = translate([...oPt1, 0], bCorner);
            let oCorner2 = translate([...oPt2, 0], bCorner);
            oCorner2 = mirror({ origin: [0, controlPoints.l1.t1[1] / 2, 0], normal: [0, 1, 0] }, oCorner2);

            let cutShape = subtract(baseShape, oCorner1);
            cutShape = subtract(cutShape, oCorner2);

            return cutShape;
        }

        /* ----------------------------------------
         * Complete Assembly
         * ------------------------------------- */

        const crown = {
            extraSmall: center({}, extraSmall(modelProperties)),
            small: center({}, small(modelProperties)),
            medium: center({}, medium(modelProperties)),
            large: center({}, large(modelProperties)),
            smallOrn1: center({}, smallOrnament1(modelProperties)),
            mediumOrn1: center({}, mediumOrnament1(modelProperties)),
            largeOrn1: center({}, largeOrnament1(modelProperties)),
        };

        const dado = {
            extraSmall: center({}, mirror(
                { normal: [0, 1, 0] },
                extraSmall(modelProperties)
            )),
            small: center({}, mirror(
                { normal: [0, 1, 0] },
                small(modelProperties)
            )),
            smallOrn1: center({}, mirror(
                { normal: [0, 1, 0] },
                smallOrnament1(modelProperties)
            )),
            medium: center({}, mirror(
                { normal: [0, 1, 0] },
                medium(modelProperties)
            )),
            mediumOrn1: center({}, mirror(
                { normal: [0, 1, 0] },
                mediumOrnament1(modelProperties)
            )),
            large: center({}, mirror(
                { normal: [0, 1, 0] },
                large(modelProperties)
            )),
            largeOrn1: center({}, mirror(
                { normal: [0, 1, 0] },
                largeOrnament1(modelProperties)
            )),
        };

        const base = {
            extraSmall: center({}, mirror(
                { normal: [0, 1, 0] },
                crown.extraSmall
            )),
            small: center({}, mirror(
                { normal: [0, 1, 0] },
                crown.small
            )),
            smallOrn1: center({}, mirror(
                { normal: [0, 1, 0] },
                crown.smallOrn1
            )),
            medium: center({}, mirror(
                { normal: [0, 1, 0] },
                crown.medium
            )),
            mediumOrn1: center({}, mirror(
                { normal: [0, 1, 0] },
                crown.mediumOrn1
            )),
            large: center({}, mirror(
                { normal: [0, 1, 0] },
                crown.large
            )),
            largeOrn1: center({}, mirror(
                { normal: [0, 1, 0] },
                crown.largeOrn1
            )),
        };

        return {
            crown,
            dado,
            base,
        }
    }

    return {
        trimFamilyAranea
    }
}

module.exports = { init: trimAranea }
