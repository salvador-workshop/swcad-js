"use strict"

/**
 * ...
 * @namespace families.tile.northAmerica
 */

const tileNorthAmerica = ({ lib, swLib }) => {

    const { cuboid } = lib.primitives
    const { maths } = swLib.core
    const { extras } = swLib.utils

    const tileStandards = {
        TILE_THICKNESS_LG: maths.inchesToMm(9 / 32), // 7.14375 mm
        TILE_THICKNESS_MD: maths.inchesToMm(1 / 4), // 6.35 mm
        TILE_THICKNESS_SM: maths.inchesToMm(7 / 32), // 5.55625 mm
        TILE_SIZE_MOSAIC: 10,
        TILE_SIZE_SM: maths.inchesToMm(3),
        TILE_SIZE_MD: maths.inchesToMm(4),
        TILE_SIZE_LG: maths.inchesToMm(5),
    }

    const thicknesses = {
        thin: tileStandards.TILE_THICKNESS_SM,
        medium: tileStandards.TILE_THICKNESS_MD,
        thick: tileStandards.TILE_THICKNESS_LG,
    }

    const sizes = {
        mosaic: tileStandards.TILE_SIZE_MOSAIC,
        small: tileStandards.TILE_SIZE_SM,
        medium: tileStandards.TILE_SIZE_MD,
        large: tileStandards.TILE_SIZE_LG,
    }

    const tileModels = {}

    Object.entries(thicknesses).forEach(([thKey, thVal], thIdx) => {
        Object.entries(sizes).forEach(([sKey, sVal], sIdx) => {
            const thicknessLabel = thKey === 'medium' ? '' : ` ${thKey}`;
            const modelName = extras.camelCase(`${sKey}${thicknessLabel}`)
            const modelSize = [sVal, sVal, thVal]

            tileModels[modelName] = {
                name: modelName,
                size: modelSize,
                length: sKey,
                lengthDim: sVal,
                thickness: thKey,
                thicknessDim: thVal,
                geom: cuboid({ size: modelSize }),
            }
        })
    })

    return tileModels
}

module.exports = { init: tileNorthAmerica }
