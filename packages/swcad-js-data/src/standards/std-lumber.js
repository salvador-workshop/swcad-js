"use strict"

/**
 * Lumber standards
 * @namespace lumber
 * @memberof data.standards
 */

const lumberStd = ({ lib, swLib }) => {
    const { constants, maths } = swLib.core

    const baseLumberSizes = {
        '1': {
            name: 'ONE',
            nominal: maths.inchesToMm(1),
            actual: maths.inchesToMm(3 / 4)
        },
        '2': {
            name: 'TWO',
            nominal: maths.inchesToMm(2),
            actual: maths.inchesToMm(1.5)
        },
        '3': {
            name: 'THREE',
            nominal: maths.inchesToMm(3),
            actual: maths.inchesToMm(2.5)
        },
        '4': {
            name: 'FOUR',
            nominal: maths.inchesToMm(4),
            actual: maths.inchesToMm(3.5)
        },
        '6': {
            name: 'SIX',
            nominal: maths.inchesToMm(6),
            actual: maths.inchesToMm(5.5)
        },
        '8': {
            name: 'EIGHT',
            nominal: maths.inchesToMm(8),
            actual: maths.inchesToMm(7.25)
        },
        '10': {
            name: 'TEN',
            nominal: maths.inchesToMm(10),
            actual: maths.inchesToMm(9.25)
        },
        '12': {
            name: 'TWELVE',
            nominal: maths.inchesToMm(12),
            actual: maths.inchesToMm(11.25)
        },
    }

    const widths = [1, 2, 3, 4, 6, 8, 10, 12]
    const depths = [1, 2, 3, 4]

    /**
     * Dimensional lumber standards
     * @memberof data.standards.lumber
     */
    const dimensional = {}
    const lumberSizes = maths.arrayCartesianProduct(depths, widths)
    lumberSizes.forEach(lumberDims => {
        const depthDim = baseLumberSizes[`${lumberDims[0]}`];
        const widthDim = baseLumberSizes[`${lumberDims[1]}`];

        const newPropName = `${depthDim.name}_BY_${widthDim.name}`;
        const newVal = {
            name: newPropName,
            nomDepth: depthDim.nominal,
            nomWidth: widthDim.nominal,
            depth: depthDim.actual,
            width: widthDim.actual,
        }
        dimensional[newPropName] = newVal
    });

    /**
     * Plywood standards
     * @memberof data.standards.lumber
     */
    const plywood = {
        thicknesses: {
            EIGHTH: {
                nominal: maths.inchesToMm(1 / 8),
                actual: maths.inchesToMm(7 / 64),
            },
            QUARTER: {
                nominal: maths.inchesToMm(1 / 4),
                actual: maths.inchesToMm(7 / 32),
            },
            THREE_SEVENTHS: {
                nominal: maths.inchesToMm(3 / 7),
                actual: maths.inchesToMm(11 / 32),
            },
            HALF: {
                nominal: maths.inchesToMm(1 / 2),
                actual: maths.inchesToMm(15 / 32),
            },
            FIVE_EIGHTHS: {
                nominal: maths.inchesToMm(5 / 8),
                actual: maths.inchesToMm(19 / 32),
            },
            THREE_QUARTERS: {
                nominal: maths.inchesToMm(3 / 4),
                actual: maths.inchesToMm(23 / 32),
            },
        },
        SHEET_LENGTH_STD: maths.inchesToMm(96),
        SHEET_WIDTH_STD: maths.inchesToMm(48),
        SHEET_LENGTH_SM: maths.inchesToMm(48),
        SHEET_WIDTH_SM: maths.inchesToMm(24),
    }

    // TODO: Add data on
    // -- pegs
    // -- biscuits
    // -- other connectors

    return {
        dimensional,
        plywood,
    }
}

module.exports = { init: lumberStd };
