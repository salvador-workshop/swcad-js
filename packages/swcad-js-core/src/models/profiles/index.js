"use strict"

const profilesInit = ({ lib, swLib }) => {
    const profiles = {
        ...require('./profiles').init({ lib, swLib }),
        edge: require('./edge').init({ lib, swLib }),
        foils2d: require('./foils-2d').init({ lib, swLib }),
        text2d: require('./text-2d').init({ lib, swLib }),
        arch: require('./arch-2d').init({ lib, swLib }),
    }

    profiles.frameRect = require('./frame-rect').init({ lib, swLib: { ...swLib, models: { profiles } } })

    return profiles
}

module.exports = { init: profilesInit };
