"use strict"

/**
 * ...
 * @memberof calcs
 * @namespace transform
 */

const transformUtils = ({ jscad, swcadJs }) => {
    const { subtract, union } = jscad.booleans
    const { measureDimensions } = jscad.measurements;
    const { cuboid, rectangle } = jscad.primitives
    const { align, mirror, rotate } = jscad.transforms
    const { colorize } = jscad.colors

    const {
        position,
    } = swcadJs.calcs

    /**
     * ...
     * @memberof calcs.transform
     * @param {object} opts 
     * @param {boolean} opts.reverse 
     * @param {object[]} geoms 
     */
    const stack = ({ reverse = false }, geoms) => {
        let stackHeight = 0
        const geomList = reverse ? geoms.reverse() : geoms
        return geomList.map(geom => {
            const alignedGeom = align({ modes: ['center', 'center', 'min'], relativeTo: [0, 0, stackHeight] }, geom)
            stackHeight = stackHeight + measureDimensions(geom)[2]
            return alignedGeom
        })
    }

    /**
     * ...
     * @param {*} inShape 
     * @returns ...
     * @memberof calcs.transform
     */
    const cutQuadrant = (inShape) => {
        const inShapeDims = measureDimensions(inShape)
        const maskDims = [
            inShapeDims[0] + 5,
            inShapeDims[1] + 5,
        ]
        const cornerCutDims = [
            maskDims[0] / 2,
            maskDims[1] / 2,
        ]
        const cornerCutCtr = [cornerCutDims[0] / 2, cornerCutDims[1] / 2, 0]

        const mask = subtract(
            rectangle({
                size: maskDims
            }),
            rectangle({
                size: cornerCutDims,
                center: cornerCutCtr,
            }),
        )

        return subtract(
            position.ctr(inShape),
            mask,
        )
    }

    /**
     * ...
     * @param {*} inShape 
     * @returns ...
     * @memberof calcs.transform
     */
    const cloneQuadrant = (inShape) => {
        const firstMirror = mirror({ normal: [0, 1, 0] }, inShape)
        const firstHalf = union(
            inShape,
            firstMirror,
        )
        const otherHalf = mirror({ normal: [1, 0, 0] }, firstHalf)

        return union(
            firstHalf,
            otherHalf,
        )
    }

    return {
        /**
         * Cuts a given geometry in half.
         * @memberof calcs.transform
         * @instance
         * @param {Object} opts
         * @param {string} opts.axis - Axis direction pointing to the remaining geometry. This could be negative, specified like "x" or "-y"
         * @param {Object} geom - Object we're cutting
         * @returns bisected geometry
         */
        bisect3d: (opts, geom) => {
            const geomDims = measureDimensions(geom);
            const baseCutBox = cuboid({
                size: [
                    geomDims[0] + 3,
                    geomDims[1] + 3,
                    geomDims[2] + 3,
                ]
            });
            let alignedCutBox = null;
            const remAxis = opts.axis || 'z';
            switch (remAxis) {
                case "-x":
                    alignedCutBox = align({ modes: ['min', 'center', 'center'] }, baseCutBox);
                    break;
                case "x":
                    alignedCutBox = align({ modes: ['max', 'center', 'center'] }, baseCutBox);
                    break;
                case "-y":
                    alignedCutBox = align({ modes: ['center', 'min', 'center'] }, baseCutBox);
                    break;
                case "y":
                    alignedCutBox = align({ modes: ['center', 'max', 'center'] }, baseCutBox);
                    break;
                case "-z":
                    alignedCutBox = align({ modes: ['center', 'center', 'min'] }, baseCutBox);
                    break;
                case "z":
                default:
                    alignedCutBox = align({ modes: ['center', 'center', 'max'] }, baseCutBox);
            }

            return subtract(
                geom,
                alignedCutBox
            );
        },
        /**
         * Cuts a slice of an object
         * @memberof calcs.transform
         * @instance
         * @param {Object} opts
         * @param {number} opts.centralAngle
         * @param {Object} geom - Object we're cutting
         * @returns bisected geometry
         */
        cutCircularSlice: (opts, geom) => {
            const geomDims = measureDimensions(geom);
            const baseCutBox = cuboid({
                size: [
                    geomDims[0] + 3,
                    geomDims[1] + 3,
                    geomDims[2] + 3,
                ]
            });

            const cutBox1 = colorize(
                [0.7, 0.7, 0.1, 0.5],
                rotate([0, 0, opts.centralAngle / 2], align({ modes: ['max', 'center', 'center'] }, baseCutBox))
            );
            const cutBox2 = mirror({ normal: [1, 0, 0] }, cutBox1);
            let cutAssembly = subtract(geom, cutBox1);
            cutAssembly = subtract(cutAssembly, cutBox2);

            return cutAssembly
        },
        stack,
        cutQuadrant,
        cloneQuadrant,
    }
}

module.exports = { init: transformUtils };
