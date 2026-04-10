const componentsModule = require('./components');
const profilesModule = require('./profiles');

const init = ({ jscad }) => {
    /**
     * Constants, standards, specs
     * @namespace data
     */
    const coreData = {
        constants: swJscad.core.constants,
        specifications: swJscad.core.specifications,
        standards: swJscad.core.standards,
    }

    /**
     * Constants, standards, specs
     * @namespace calcs
     */
    const coreCalcs = {
        math: swJscad.core.maths,
        geometry: swJscad.core.geometry,
        position: swJscad.core.position,
        transform: swJscad.utils.transform,
    }

    const coreProfiles = {
        text: swJscad.models.profiles.text2d,
        trim: swJscad.families.trim,
        connections: swJscad.models.profiles.connections,
        curves: swJscad.models.profiles.curves,
        edge: swJscad.models.profiles.edge,
        structure: {
            arch: swJscad.models.profiles.arch,
            foil: swJscad.models.profiles.foils2d,
            mesh: swJscad.models.profiles.mesh2d,

        },
        shapes: {
            ellipse: swJscad.models.profiles.ellipse,
            octagon: swJscad.models.profiles.octagonal,
            rectangle: {
                ...swJscad.models.profiles.rectangle,
                frame: swJscad.models.profiles.frameRect,
            },
            triangle: swJscad.models.profiles.triangle,
            square: {
                sqCornerCircNotch: swJscad.models.profiles.sqCornerCircNotch,
                sqCornerCircles: swJscad.models.profiles.sqCornerCircles,
            }
        }
    }

    const coreProfileSpec = {
        lumber: swJscad.families.lumber,
        paper: swJscad.families.paper,
    }

    const coreComponents = {
        text: swJscad.models.prefab.text3d,
        mesh: swJscad.models.prefab.mesh3d,
        moulding: swJscad.models.prefab.mouldings,
        dowelFittings: swJscad.families.dowelFittings,
    }

    const coreComponentSpec = {
        brick: swJscad.families.brick,
        tile: swJscad.families.tile,
        crafts: swJscad.families.crafts,
    }

    const coreModels = {
        foil: swJscad.models.prefab.foils3d,
        arch: swJscad.models.prefab.arch,
        buttress: swJscad.builders.buttress,
        wall: {
            ...swJscad.builders.walls,
            entryway: swJscad.builders.entryways
        },
        column: swJscad.builders.columns,
        roof: swJscad.builders.roofs,
    }

    const coreUtils = {
        extras: swJscad.utils.extras,
        colors: swJscad.ui.ux.colors,
        layout: swJscad.ui.ux.layout,
    }

    /**
     * Old functions organized in the new style
     * @since 0.11.1
     * */
    const swcadJsCore = {
        data: coreData,
        calcs: coreCalcs,
        profiles: coreProfiles,
        profileSpec: coreProfileSpec,
        components: coreComponents,
        componentSpec: coreComponentSpec,
        models: coreModels,
        utils: coreUtils,
    }


    // ----------------
    // New Components
    // ----------------

    const swcadJsProfiles = profilesModule.init({ jscad, swcadJs: swcadJsCore })
    const profiles = {
        ...coreProfiles,
        ...swcadJsProfiles,
    }
    swcadJsCore.profiles = profiles

    const swcadJsComponents = componentsModule.init({ jscad, swcadJs: swcadJsCore });
    const components = {
        ...coreComponents,
        ...swcadJsComponents,
    }

    /**
     * User-facing library
     * @since 0.11.1
     * */
    const swcadJs = {
        data: swcadJsCore.data,
        calcs: swcadJsCore.calcs,
        profiles: swcadJsCore.profiles,
        profileSpec: swcadJsCore.profileSpec,
        components: components,
        componentSpec: swcadJsCore.componentSpec,
        models: swcadJsCore.models,
        utils: swcadJsCore.utils,
    }

    console.log('swcadJs initialized', swcadJs);

    return swcadJs
}

module.exports = { init };
