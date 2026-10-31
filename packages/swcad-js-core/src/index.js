"use strict"

const coreInit = ({ jscad }) => {

    /**
     * First step to building the library
     * */
    const swcadJsCore = {
        data: require('swcad-js-data').init({ jscad }),
        calcs: null,
        profiles: null,
        profileSpec: null,
        components: null,
        componentSpec: null,
        utils: null,
        models: null,
    }


    /**
     * Intermediate step to building the library
     * */
    let swcadJsAssembly = swcadJsCore

    const assemblyCalcs = require('swcad-js-calcs').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.calcs = assemblyCalcs

    const assemblyProfiles = require('swcad-js-profiles').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.profiles = assemblyProfiles

    const assemblyComponents = require('swcad-js-components').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.components = assemblyComponents

    const assemblyUtils = require('swcad-js-utils').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.utils = assemblyUtils

    const assemblyModels = require('swcad-js-models').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.models = assemblyModels


    /**
     * User-facing library
     * */
    const swcadJs = {
        data: swcadJsAssembly.data,
        calcs: swcadJsAssembly.calcs,
        profiles: swcadJsAssembly.profiles,
        components: swcadJsAssembly.components,
        utils: swcadJsAssembly.utils,
        models: swcadJsAssembly.models,
    }

    return swcadJs
}

module.exports = {
    init: coreInit,
};
