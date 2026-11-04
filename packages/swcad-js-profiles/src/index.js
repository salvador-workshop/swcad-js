"use strict"

const beadsBitsModule = require('./beads-bits')
const boxCurveModule = require('./box-curve')
const connectionsModule = require('./connections')
const curveModule = require('./curve')
const jointPanelModule = require('./joint-panel')
const meshModule = require('./mesh')
const reinforcementsModule = require('./reinforcements')
const textModule = require('./text')
const trimModule = require('./trim')

const profilesInit = ({ jscad, swcadJs }) => {
    const curve = curveModule.init({ jscad, swcadJs })
    const beadsBits = beadsBitsModule.init({ jscad, swcadJs })

    let preLib = {
        ...swcadJs,
        profiles: {
            curve,
            beadsBits,
        }
    }

    const connections = connectionsModule.init({ jscad, swcadJs: preLib })
    preLib = {
        ...swcadJs,
        profiles: {
            curve,
            beadsBits,
            connections
        }
    }

    return {
        beadsBits,
        boxCurve: boxCurveModule.init({ jscad, swcadJs: preLib }),
        connections,
        curve,
        jointPanel: jointPanelModule.init({ jscad, swcadJs: preLib }),
        mesh: meshModule.init({ jscad, swcadJs: preLib }),
        reinforcements: reinforcementsModule.init({ jscad, swcadJs: preLib }),
        text: textModule.init({ jscad, swcadJs: preLib }),
        trim: trimModule.init({ jscad, swcadJs: preLib }),
    }
}

module.exports = {
    init: profilesInit,
};
