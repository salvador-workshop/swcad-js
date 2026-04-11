"use strict"

/**
 * ...
 * @memberof profileSpec.lumber
 * @namespace northAmerica
 */

const lumberNorthAmerica = ({ jscad, swcadJs }) => {

    const { rectangle } = jscad.primitives;
    const { lumber } = swcadJs.data.standards;

    const dimLumberModels = []
    for (const [stdKey, stdVal] of Object.entries(lumber.dimensional)) {
        const hasDepth = typeof stdVal === 'object' && 'depth' in stdVal;
        const hasWidth = typeof stdVal === 'object' && 'depth' in stdVal;
        if (hasDepth && hasWidth) {
            dimLumberModels.push({
                id: stdKey,
                ...stdVal,
                geom: rectangle({ size: [stdVal.width, stdVal.depth] })
            });
        }
    }

    const output = {
        dimensional: dimLumberModels,
    }

    return output;
}

module.exports = { init: lumberNorthAmerica }
