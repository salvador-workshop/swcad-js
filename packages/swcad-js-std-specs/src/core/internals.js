"use strict"

/**
 * ...
 * @namespace core.internals
 */

const internals = ({ lib, swLib }) => {

    //-------------------
    // Master Prop List

    // General
    const propListBasic = [
        { id: 'length', desc: 'length of element' },
        { id: 'width', desc: 'Width of element' },
        { id: 'height', desc: 'height of element' },
    ]

    // Decorative details
    const propListDecorative = [
        { id: 'trimOpts', desc: 'array of string options' },
        { id: 'trimUnitSize', desc: '[x,y] of trim unit depth, and trim unit height' },
    ]

    const propListWall = [
        { id: 'wallSize', desc: '[x,y,z] of wall length, wall thickness, and wall height' },
        { id: 'crownDetailLvl', desc: 'crown detail level, as integer (usually 0-2)' },
        { id: 'dadoDetailLvl', desc: 'dado detail level, as integer (usually 0-2)' },
        { id: 'baseDetailLvl', desc: 'base detail level, as integer (usually 0-2)' },
    ]

    const propListRoof = [
        { id: 'roofSpanSize', desc: 'length of element' },
        { id: 'roofOverhangSize', desc: 'Width of element' },
        { id: 'roofPitch', desc: 'height of element' },
    ]

    // Parameters used by building & design commands
    const propListVariants = [
        { id: 'family', desc: 'General grouping' },
        { id: 'type', desc: 'Functional grouping' },
        { id: 'subType', desc: 'Functional subgroup' },
        { id: 'tagsVariants', desc: 'Extra options for variants' },
    ]

    const masterPropList = [
        ...propListBasic,
        ...propListDecorative,
        ...propListWall,
        ...propListRoof,
    ]


    //-------------------
    // Colours

    const colourList = [];

    //-------------------
    // Layers

    const layerList = [];

    return {
        propListBasic,
        propListWall,
        propListRoof,
        propListVariants,
        masterPropList,
        colourList,
        layerList,
    }

}

module.exports = { init: internals };
