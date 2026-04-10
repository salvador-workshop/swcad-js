"use strict"

const profilesInit = ({ jscad, swcadJs }) => {
    const profiles = {
        ...require('./profiles').init({ jscad, swcadJs }),
        edge: require('./edge').init({ jscad, swcadJs }),
        foils2d: require('./foils-2d').init({ jscad, swcadJs }),
        text2d: require('./text-2d').init({ jscad, swcadJs }),
        arch: require('./arch-2d').init({ jscad, swcadJs }),
    }

    profiles.frameRect = require('./frame-rect').init({ jscad, swcadJs: { ...swcadJs, models: { profiles } } })

    return profiles
}

module.exports = { init: profilesInit };
