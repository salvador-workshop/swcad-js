const stdSpecsPackage = require('swcad-js-std-specs');
const familiesPackage = require('swcad-js-families');
const uiPackage = require('swcad-js-ui');
const buildersPackage = require('swcad-js-builders');

const coreModule = require('./core');
const utilsModule = require('./utils');
const modelModule = require('./models');

const init = ({ lib }) => {
    const stdSpecs = stdSpecsPackage.init({ lib });

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

    const swcadJsFamilies = familiesPackage.init({ lib, swLib: swcadJsCore })
    const swcadJsUi = uiPackage.init({ lib, swLib: swcadJsCore })
    const swcadJsBuilders = buildersPackage.init({ lib, swLib: swcadJsCore, swFamilies: swcadJsFamilies })

    /** Functions organized in the old style */
    const swJsCad = {
        ...swcadJsCore,
        families: swcadJsFamilies,
        ui: swcadJsUi,
        builders: swcadJsBuilders,
    }

    return swJsCad;
}

module.exports = { init };
