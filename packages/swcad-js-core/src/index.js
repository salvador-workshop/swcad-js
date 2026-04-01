// TODO: Replace relative paths with package imports once build tools are in place
const stdSpecsPackage = require('../../swcad-js-std-specs');
const familiesPackage = require('../../swcad-js-families');
const uiPackage = require('../../swcad-js-ui');
const buildersPackage = require('../../swcad-js-builders');

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

    /** Functions organized in the new style */
    const swcadJs = {
        profiles: {
            mesh: swJsCad.models.profiles.mesh2d,
            foil: swJsCad.models.profiles.foils2d,
            arch: swJsCad.builders.arches,
            trim: swJsCad.families.trim,
            lumber: swJsCad.families.lumber,
            paper: swJsCad.families.paper,
        },
        components: {
            mesh: swJsCad.models.prefab.mesh3d,
            tile: swJsCad.families.tile,
            crafts: swJsCad.families.crafts,
        },
        models: {
            foil: swJsCad.models.prefab.foils3d,
            arch: swJsCad.builders.arches,
            buttress: swJsCad.builders.buttress,
            wall: {
                ...swJsCad.builders.walls,
                entryway: swJsCad.builders.entryways
            },
            column: swJsCad.builders.columns,
            roof: swJsCad.builders.roofs,
        },
        utils: {
            constants: swJsCad.core.constants,
            math: swJsCad.core.maths,
            geometry: swJsCad.core.geometry,
            transform: swJsCad.utils.transform,
            specifications: swJsCad.core.specifications,
            standards: swJsCad.core.standards,
            colors: swJsCad.ui.ux.colors,
        },
    }

    return swcadJs;
}

module.exports = { init };
