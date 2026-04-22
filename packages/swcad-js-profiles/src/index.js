"use strict"

const beadsBitsModule = require('./beads-bits')
const connectionsModule = require('./connections')
const curveModule = require('./curve')
const shapesModule = require('./shapes')
const rectFrameModule = require('./shapes/rectangle/frame-rect')
const structureModule = require('./structure')
const textModule = require('./text')
const trimModule = require('./trim')

const profilesInit = ({ jscad, swcadJs }) => {
    const shapesCore = shapesModule.init({ jscad, swcadJs })
    const curve = curveModule.init({ jscad, swcadJs })
    const beadsBits = beadsBitsModule.init({ jscad, swcadJs })

    const preLib = {
        ...swcadJs,
        profiles: {
            shapes: shapesCore,
            curve,
            beadsBits,
        }
    }

    const shapes = {
        ...shapesCore,
        rectangle: {
            ...shapesCore.rectangle,
            frame: rectFrameModule.init({ jscad, swcadJs: preLib }),
        }
    }

    return {
        shapes,
        beadsBits,
        connections: connectionsModule.init({ jscad, swcadJs: preLib }),
        curve,
        structure: structureModule.init({ jscad, swcadJs: preLib }),
        text: textModule.init({ jscad, swcadJs: preLib }),
        trim: trimModule.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: profilesInit,
};
