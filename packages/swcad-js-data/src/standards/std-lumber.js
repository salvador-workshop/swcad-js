"use strict"

const inchesToMm = (numIn) => numIn * 25.4
const arrayCartesianProduct = (a, b) => a.reduce((acc, x) => [...acc, ...b.map(y => [x, y])], []);

/**
 * Lumber standards
 * @namespace lumber
 * @memberof data.standards
 */

const lumberStd = ({ jscad }) => {

    const baseLumberSizes = {
        '1': {
            name: 'ONE',
            nominal: inchesToMm(1),
            actual: inchesToMm(3 / 4)
        },
        '2': {
            name: 'TWO',
            nominal: inchesToMm(2),
            actual: inchesToMm(1.5)
        },
        '3': {
            name: 'THREE',
            nominal: inchesToMm(3),
            actual: inchesToMm(2.5)
        },
        '4': {
            name: 'FOUR',
            nominal: inchesToMm(4),
            actual: inchesToMm(3.5)
        },
        '6': {
            name: 'SIX',
            nominal: inchesToMm(6),
            actual: inchesToMm(5.5)
        },
        '8': {
            name: 'EIGHT',
            nominal: inchesToMm(8),
            actual: inchesToMm(7.25)
        },
        '10': {
            name: 'TEN',
            nominal: inchesToMm(10),
            actual: inchesToMm(9.25)
        },
        '12': {
            name: 'TWELVE',
            nominal: inchesToMm(12),
            actual: inchesToMm(11.25)
        },
    }

    const widths = [1, 2, 3, 4, 6, 8, 10, 12]
    const depths = [1, 2, 3, 4]

    /**
     * Dimensional lumber standards
     * @memberof data.standards.lumber
     */
    const dimensional = {}
    const lumberSizes = arrayCartesianProduct(depths, widths)
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
                nominal: inchesToMm(1 / 8),
                actual: inchesToMm(7 / 64),
            },
            QUARTER: {
                nominal: inchesToMm(1 / 4),
                actual: inchesToMm(7 / 32),
            },
            THREE_SEVENTHS: {
                nominal: inchesToMm(3 / 7),
                actual: inchesToMm(11 / 32),
            },
            HALF: {
                nominal: inchesToMm(1 / 2),
                actual: inchesToMm(15 / 32),
            },
            FIVE_EIGHTHS: {
                nominal: inchesToMm(5 / 8),
                actual: inchesToMm(19 / 32),
            },
            THREE_QUARTERS: {
                nominal: inchesToMm(3 / 4),
                actual: inchesToMm(23 / 32),
            },
        },
        SHEET_LENGTH_STD: inchesToMm(96),
        SHEET_WIDTH_STD: inchesToMm(48),
        SHEET_LENGTH_SM: inchesToMm(48),
        SHEET_WIDTH_SM: inchesToMm(24),
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
