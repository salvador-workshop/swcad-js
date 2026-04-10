"use strict"

const coreInit = ({ jscad }) => {

    /**
     * First step to building the library
     * @since 0.11.1
     * */
    const swcadJsCore = {
        data: require('swcad-js-data').init({ jscad }),
        calcs: null,
        utils: null,
        profiles: null,
        profileSpec: null,
        components: null,
        componentSpec: null,
        models: null,
    }


    /**
     * Intermediate step to building the library
     * @since 0.11.1
     * */
    let swcadJsAssembly = swcadJsCore

    const assemblyCalcs = require('swcad-js-calcs').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.calcs = assemblyCalcs

    const assemblyUtils = require('swcad-js-utils').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.utils = assemblyUtils

    const assemblyProfiles = require('swcad-js-profiles').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.profiles = assemblyProfiles

    const assemblyProfileSpec = require('swcad-js-profile-spec').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.profileSpec = assemblyProfileSpec

    const assemblyComponents = require('swcad-js-components').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.components = assemblyComponents

    const assemblyComponentSpec = require('swcad-js-component-spec').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.componentSpec = assemblyComponentSpec

    const assemblyModels = require('swcad-js-models').init({ jscad, swcadJs: swcadJsAssembly })
    swcadJsAssembly.models = assemblyModels


    /**
     * User-facing library
     * @since 0.11.1
     * */
    const swcadJs = {
        data: swcadJsCore.data,
        calcs: swcadJsCore.calcs,
        utils: swcadJsCore.utils,
        profiles: swcadJsCore.profiles,
        profileSpec: swcadJsCore.profileSpec,
        components: components,
        componentSpec: swcadJsCore.componentSpec,
        models: swcadJsCore.models,
    }

    console.log('swcadJs initialized', swcadJs);

    return swcadJs
}

module.exports = {
    init: coreInit,
};
