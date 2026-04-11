# swcad-js

Salvador Workshop's CAD coding tools (in JavaScript)

---

![swcad-js demo - arch-foils](./static/img/collage-arch-foils.jpg "swcad-js demo - arch-foils")

Online viewer: [sw-jscad-viewer.netlify.app/](https://sw-jscad-viewer.netlify.app/)  

API Docs: [salvador-workshop.github.io/swcad-js/](https://salvador-workshop.github.io/swcad-js/)  

NPM package: [npmjs.com/package/swcad-js](https://www.npmjs.com/package/swcad-js)  

![swcad-js demo - walls-entryway](./static/img/entryways-1.png "swcad-js demo - walls-entryway")

## Usage

Works with JSCAD, however you consume it.

```javascript
"use strict"
const jscad = require('@jscad/modeling')

const swCadJs = require('swcad-js').init({ lib: jscad });
console.log('swCadJs', swCadJs)

const {
    moulding,
} = swCadJs.components

const {
    arch,
    column,
    wall,
    foil: foil3d,
} = swCadJs.models

const {
    shapes,
    foil: foil2d,
} = swCadJs.profiles

const {
    aranea,
} = swCadJs.profiles.trim

const {
    layout,
} = swCadJs.utils


const main = () => {
    const layoutOpts = {
        layoutMargin: 18,
        layoutSpace: 5,
    }


    //-----------
    // Profiles

    const profile1 = shapes.square.sqCornerCircNotch({ sqLength: 5 });
    const profile3 = shapes.octagon({ sqLength: 5 });

    const tFamilyBasic = aranea.buildTrimFamily({ unitHeight: 20, unitDepth: 10 });
    const dadoTrim = [
        tFamilyBasic.dado.small,
        tFamilyBasic.dado.medium,
        tFamilyBasic.dado.large,
        tFamilyBasic.dado.mediumOrn1,
    ];
    dadoTrim.forEach((trim, idx) => {
        layout.addToLayout({ name: `dado-${idx}`, desc: '...', layoutOpts }, trim);
    })


    //-----------
    // Mouldings

    const mould3 = moulding.circularMoulding({ radius: 20, height: 5 }, profile1);
    layout.addToLayout({ name: 'mould3', desc: '...', layoutOpts }, mould3);


    //-----------
    // Foils

    const foil1 = foil2d.trefoil({ radius: 10 });
    layout.addToLayout({ name: 'foil1', desc: '...', layoutOpts }, foil1);

    const foil5 = foil2d.quatrefoil({ radius: 10, lobeRadiusType: 'inSlice' });
    layout.addToLayout({ name: 'foil5', desc: '...', layoutOpts }, foil5);

    const foil7 = foil3d.trefoil({ radius: 15, lobeRadiusType: 'halfRadius', cutCentre: true }, profile1);
    layout.addToLayout({ name: 'foil7', desc: '...', layoutOpts }, foil7);

    const foil8 = foil3d.quatrefoil({ radius: 15, lobeRadiusType: 'mean', cutCentre: true }, profile3);
    layout.addToLayout({ name: 'foil8', desc: '...', layoutOpts }, foil8);


    //-----------
    // Columns

    const col2 = column.threePtColumn({
        base: ['roundCylinder', 2, 3.5],
        shaft: ['extrude', null, profile1],
        capital: ['roundCylinder', 2, 3.5],
        height: 20,
    });
    layout.addToLayout({ name: 'col2', desc: '...', layoutOpts }, col2);


    //-----------
    // Arches

    const arch1 = arch.twoPtArch({ arcRadius: 30, archWidth: 35, profileWidth: 5 }, profile1);
    layout.addToLayout({ name: 'arch1', desc: '...', layoutOpts }, arch1);

    const arch2 = arch.twoPtArch({ arcRadius: 30, archWidth: 35 });
    layout.addToLayout({ name: 'arch2', desc: '...', layoutOpts }, arch2);


    //-----------
    // Walls

    const wall2 = wall.buildWall({
        height: 100,
        thickness: 10,
        length: 80,
        // wallOpts: 0,
        trimOpts: ['base', 'crown'],
        crownUnits: 1,
        baseUnits: 2,
        trimUnitHeight: 4,
        trimUnitDepth: 1.25,
        trimSides: 4,
    });
    layout.addToLayout({ name: 'Wall (2)', desc: '...', layoutOpts }, wall2);

    const wallDado1 = wall.buildWall({
        height: 100,
        thickness: 10,
        length: 70,
        // wallOpts: 0,
        trimOpts: ['base', 'dado', 'crown'],
        dadoUnits: 1,
        trimUnitHeight: 4,
        trimUnitDepth: 1.25,
        trimSides: 4,
    });
    layout.addToLayout({ name: 'Dado Wall (1)', desc: '...', layoutOpts }, wallDado1)

    const layoutContent = layout.gridLayout({ layoutOpts });
    return layoutContent;
}

module.exports = { main }
```
