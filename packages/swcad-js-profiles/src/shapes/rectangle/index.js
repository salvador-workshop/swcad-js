"use strict"

const rectFrame = require('./frame-rect')

const rectangleInit = ({ jscad, swcadJs }) => {
    const { square, circle, rectangle, triangle, ellipse } = jscad.primitives
    const { intersect, union, subtract } = jscad.booleans
    const { rotate, align } = jscad.transforms
    const { geom2, path2 } = jscad.geometries

    const { constants } = swcadJs.data
    const { position } = swcadJs.calcs

    //--------------
    //  RECTANGLES
    //--------------

    const createRect = ({ length, width, ratio }) => {
        const validSize = [
            length || width * ratio,
            width || length / ratio
        ]
        return rectangle({ size: validSize });
    }

    /**
     * Rectangle profiles
     * @memberof profiles.shapes
     * @namespace rectangle
     */
    const rectangles = {
        /**
         * ...
         * @memberof profiles.shapes.rectangle
         * @param {object} opts
         * @returns ...
         */
        golden: ({ length, width }) => {
            return createRect({ length, width, ratio: constants.PHI });
        },
        /**
         * ...
         * @memberof profiles.shapes.rectangle
         * @param {object} opts
         * @returns ...
         */
        sixtyThirty: ({ length, width }) => {
            return createRect({ length, width, ratio: 2 });
        },
        /**
         * ...
         * @memberof profiles.shapes.rectangle
         * @param {object} opts
         * @returns ...
         */
        silver: ({ length, width }) => {
            return createRect({ length, width, ratio: constants.SILVER_RATIO });
        },
        /**
         * ...
         * @memberof profiles.shapes.rectangle
         * @param {object} opts
         * @returns ...
         */
        bronze: ({ length, width }) => {
            return createRect({ length, width, ratio: constants.BRONZE_RATIO });
        },
        /**
         * ...
         * @memberof profiles.shapes.rectangle
         * @param {object} opts
         * @returns ...
         */
        copper: ({ length, width }) => {
            return createRect({ length, width, ratio: constants.COPPER_RATIO });
        },
        /**
         * ...
         * @memberof profiles.shapes.rectangle
         * @param {object} opts
         * @returns ...
         */
        superGolden: ({ length, width }) => {
            return createRect({ length, width, ratio: constants.SUPERGOLDEN_RATIO });
        },
        /**
         * ...
         * @memberof profiles.shapes.rectangle
         * @param {object} opts
         * @returns ...
         */
        plastic: ({ length, width }) => {
            return createRect({ length, width, ratio: constants.PLASTIC_RATIO });
        },
    }

    return {
        ...rectangles,
    }
}

module.exports = {
    init: rectangleInit,
};
