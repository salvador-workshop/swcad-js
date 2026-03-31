const coreModule = require('./core');
const utilsModule = require('./utils');
const modelModule = require('./models');

const stdSpecsModule = require('swcad-js-std-specs');
const familiesModule = require('swcad-js-families');
const uiModule = require('swcad-js-ui');
const buildersModule = require('swcad-js-builders');

const init = ({ lib }) => {
    const stdSpecs = stdSpecsModule.init({ lib });
    stdSpecs.constants.SILVER_RATIO = 1 + Math.sqrt(2)          // 2.4142
    stdSpecs.constants.BRONZE_RATIO = 3 + Math.sqrt(13) / 2     // 3.3028
    stdSpecs.constants.COPPER_RATIO = 2 + Math.sqrt(5)          // 4.2361
    stdSpecs.constants.SUPERGOLDEN_RATIO = 1.4655712319
    stdSpecs.constants.PLASTIC_RATIO = 1.3247179572

    const swcadJsCore = {
        core: { ...stdSpecs, ...coreModule.init({ stdSpecs, lib }) },
    }

    swcadJsCore.utils = utilsModule.init({ lib, swLib: swcadJsCore });
    swcadJsCore.models = modelModule.init({ lib, swLib: swcadJsCore });

    const swcadJsFamilies = familiesModule.init({ lib, swLib: swcadJsCore })
    const swcadJsUi = uiModule.init({ lib, swLib: swcadJsCore })
    const swcadJsBuilders = buildersModule.init({ lib, swLib: swcadJsCore, swFamilies: swcadJsFamilies })

    const swcadJs = {
        ...swcadJsCore,
        families: swcadJsFamilies,
        ui: swcadJsUi,
        builders: swcadJsBuilders,
    }

    return swcadJs;
}

module.exports = { init };
