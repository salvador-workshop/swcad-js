"use strict"

/**
 * ...
 * @namespace families.brick.northAmerica
 */


const brickNorthAmerica = ({ lib, swLib }) => {

    const { cuboid } = lib.primitives;
    const { masonry } = swLib.core.standards;

    const brickNorAm = {}
    const brickNorAmSpecs = [
        {
            name: "nominal",
            length: masonry.brick.US_BRICK_LENGTH_NOM,
            width: masonry.brick.US_BRICK_WIDTH_NOM,
            height: masonry.brick.US_BRICK_HEIGHT_NOM,
        },
        {
            name: "actualStdJoint",
            length: masonry.brick.US_BRICK_LENGTH,
            width: masonry.brick.US_BRICK_WIDTH,
            height: masonry.brick.US_BRICK_HEIGHT,
        },
        {
            name: "actualWideJoint",
            length: masonry.brick.US_BRICK_LENGTH_LG_JOINT,
            width: masonry.brick.US_BRICK_WIDTH_LG_JOINT,
            height: masonry.brick.US_BRICK_HEIGHT_LG_JOINT,
        },
    ]

    brickNorAmSpecs.forEach(brickSpec => {
        brickNorAm[brickSpec.name] = cuboid({ size: [brickSpec.length, brickSpec.width, brickSpec.height] })
    })

    return brickNorAm
}

module.exports = { init: brickNorthAmerica }
