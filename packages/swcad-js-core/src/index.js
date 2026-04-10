const componentsModule = require('./components');
const profilesModule = require('./profiles');

const init = ({ jscad }) => {
    const swJscad = require('./sw-jscad').init({ lib: jscad });
    console.log('swJscad initialized', swJscad);

    const coreProfiles = {
        text: swJscad.models.profiles.text2d,
        mesh: swJscad.models.profiles.mesh2d,
        foil: swJscad.models.profiles.foils2d,
        arch: swJscad.models.profiles.arch,
        trim: swJscad.families.trim,
        lumber: swJscad.families.lumber,
        paper: swJscad.families.paper,
        connections: swJscad.models.profiles.connections,
        curves: swJscad.models.profiles.curves,
        edge: swJscad.models.profiles.edge,
        frameRect: swJscad.models.profiles.frameRect,
        shapes: {
            ellipse: swJscad.models.profiles.ellipse,
            octagon: swJscad.models.profiles.octagonal,
            rectangle: swJscad.models.profiles.rectangle,
            triangle: swJscad.models.profiles.triangle,
            square: {
                sqCornerCircNotch: swJscad.models.profiles.sqCornerCircNotch,
                sqCornerCircles: swJscad.models.profiles.sqCornerCircles,
            }
        }
    }

    const coreComponents = {
        text: swJscad.models.prefab.text3d,
        mesh: swJscad.models.prefab.mesh3d,
        tile: swJscad.families.tile,
        crafts: swJscad.families.crafts,
        moulding: swJscad.models.prefab.mouldings,
        dowelFittings: swJscad.families.dowelFittings,
        brick: swJscad.families.brick,
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
        math: swJscad.core.maths,
        geometry: swJscad.core.geometry,
        position: swJscad.core.position,
        extras: swJscad.utils.extras,
        transform: swJscad.utils.transform,
        colors: swJscad.ui.ux.colors,
        layout: swJscad.ui.ux.layout,
    }

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
     * Old functions organized in the new style
     * @since 0.10.8
     * */
    const swcadJsCore = {
        profiles: coreProfiles,
        components: coreComponents,
        models: coreModels,
        utils: coreUtils,
        data: coreData,
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
     * @since 0.10.8
     * */
    const swcadJs = {
        components,
        profiles: swcadJsCore.profiles,
        models: swcadJsCore.models,
        utils: swcadJsCore.utils,
        data: swcadJsCore.data,
    }

    console.log('swcadJs initialized', swcadJs);

    return swcadJs
}

module.exports = { init };
