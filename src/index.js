const stdSpecsModule = require('swcad-js-std-specs');
const coreModule = require('swcad-js-core');
const familiesModule = require('swcad-js-families');
const uiModule = require('swcad-js-ui');
const buildersModule = require('swcad-js-builders');

const init = ({ lib }) => {
    const swcadJsCore = coreModule.init({ lib })

    const swcadJsFamilies = coreModule.init({ lib, swLib: swcadJsCore })
    const swcadJsUi = coreModule.init({ lib, swLib: swcadJsCore })

    const swcadJsBuilders = coreModule.init({ lib, swLib: swcadJsCore, swFamilies: swcadJsFamilies })

    const swcadJs = {
        ...swcadJsCore,
        ui: swcadJsUi,
        builders: swcadJsBuilders,
    }

    return swcadJs;
}

module.exports = { init };
