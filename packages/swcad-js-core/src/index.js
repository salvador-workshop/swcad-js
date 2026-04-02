const componentsModule = require('./components');

const init = ({ lib }) => {
    const swJscad = require('./sw-jscad').init({ lib });
    console.log('swJscad initialized:', swJscad);

    const profiles = {
        text: swJscad.models.profiles.text2d,
        mesh: swJscad.models.profiles.mesh2d,
        foil: swJscad.models.profiles.foils2d,
        arch: swJscad.builders.arches,
        trim: swJscad.families.trim,
        lumber: swJscad.families.lumber,
        paper: swJscad.families.paper,
        connections: swJscad.models.profiles.connections,
        curves: swJscad.models.profiles.curves,
        edge: swJscad.models.profiles.edge,
        frameRect: swJscad.models.profiles.frameRect,
        reinforcement: swJscad.models.profiles.reinforcement,
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

    const componentsData = componentsModule.init({ lib, swJscad });

    const components = {
        ...componentsData,
        text: swJscad.models.prefab.text3d,
        mesh: swJscad.models.prefab.mesh3d,
        tile: swJscad.families.tile,
        crafts: swJscad.families.crafts,
        moulding: swJscad.models.prefab.mouldings,
        dowelFittings: swJscad.families.dowelFittings,
        brick: swJscad.families.brick,
    }

    const models = {
        foil: swJscad.models.prefab.foils3d,
        arch: swJscad.builders.arches,
        buttress: swJscad.builders.buttress,
        wall: {
            ...swJscad.builders.walls,
            entryway: swJscad.builders.entryways
        },
        column: swJscad.builders.columns,
        roof: swJscad.builders.roofs,
    }

    const utils = {
        constants: swJscad.core.constants,
        math: swJscad.core.maths,
        geometry: swJscad.core.geometry,
        position: swJscad.core.position,
        extras: swJscad.utils.extras,
        transform: swJscad.utils.transform,
        specifications: swJscad.core.specifications,
        standards: swJscad.core.standards,
        colors: swJscad.ui.ux.colors,
        layout: swJscad.ui.ux.layout,
    }

    /** Functions organized in the new style */
    const swcadJs = {
        profiles,
        components,
        models,
        utils,
    }

    return swcadJs;
}

module.exports = { init };
