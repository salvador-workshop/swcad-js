"use strict"

const araneaModule = require('./trim-aranea')
const bibliopoliModule = require('./trim-bibliopoli')
const catonisModule = require('./trim-catonis')

/**
 * Trim profiles and families
 * @memberof profiles
 * @namespace trim
 */

const init = ({ jscad, swcadJs }) => {
    const trim = {
        aranea: araneaModule.init({ jscad, swcadJs }),
        bibliopoli: bibliopoliModule.init({ jscad, swcadJs }),
        catonis: catonisModule.init({ jscad, swcadJs }),
    }

    return trim;
}

module.exports = { init };
