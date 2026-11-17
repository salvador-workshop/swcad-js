# swcad-js

Salvador Workshop's CAD coding tools (in JavaScript)

---

![swcad-js demo - plinth base](./static/img/base.png "swcad-js demo - plinth base")

## Overview

### Online viewer

[sw-jscad-viewer.netlify.app](https://sw-jscad-viewer.netlify.app/)  

A heavily customized version of the JSCAD UI ([https://github.com/hrgdavor/jscadui](https://github.com/hrgdavor/jscadui))

### API Docs  

[salvador-workshop.github.io/swcad-js/](https://salvador-workshop.github.io/swcad-js/)  

### Repository

[github.com/salvador-workshop/swcad-js/](https://github.com/salvador-workshop/swcad-js/)  

### NPM package

[npmjs.com/package/swcad-js](https://www.npmjs.com/package/swcad-js)  

<br/>

## Usage

The library can be used in a JSCAD script like so:

```javascript
// Library initialization
const jscad = require('@jscad/modeling')
const swcadJs = require('swcad-js').init({ jscad });

// Initializing JSCAD functionality
const {
    cube,
    cylinder,
    sphere,
} = jscad.primitives

const {
    translate,
    rotate,
} = jscad.transforms

// Initializing SWCAD-JS functionality
const {
    mesh,
} = swcadJs.components

const {
    math
} = swcadJs.calcs;

// Typical JSCAD main function
const main = () => {

    // Creating a mesh panel. Note the array output format
    const meshPanelExample = mesh.meshPanel({
        size: [math.inchesToMm(3), math.inchesToMm(4)],
        thickness: 2,
        holeRadius: 3,
        holeDistance: math.inchesToMm(3 / 4),
        holePattern: 'tri',
    })[0]
    
    return meshPanelExample
}

module.exports = { main }
```

Many more examples can be found on the [SW JSCAD Viewer](https://sw-jscad-viewer.netlify.app/).

### Component/Profile Output

SWCAD-JS component and profile functions typically return an array of three values:

```javascript
const [
    mainModel, // the output model itself (JSCAD geom2/geom3)
    modelParts, // main model + various sub-components
    modelProperties, // props (dims, options, etc.) used during assembly
] = swcadJs.components.mesh.meshPanel(opts)
```

While it may appear verbose, this allows the consumer to have the output model AND auxiliary data for building around that model. Details around specific `modelParts` may be found in the [API documentation](https://salvador-workshop.github.io/swcad-js/).

For more detail, here's a source excerpt for one such function:

```javascript
const mediumReinforcedRing = (opts) => {
    // ...
    
    const mainModel = position.ctr(ringAssembly)
    const modelParts = {
        mainModel,
        base: ringReinfBase,
        innerEdge: ringReinfInnerEdge,
        spokes: ringReinfSpokes,
    }
    return [mainModel, modelParts, modelProperties]
}
```

<br/>

## SWCAD-JS API -- Overview

A quick overview of SWCAD-JS functions and utilities. For more information, check the [API documentation](https://salvador-workshop.github.io/swcad-js/).

<br/>

### DATA

Mostly math constants and common dimensions/options.

### data.constants

Numeric constants and ratios.

### data.standards

Dimensions and options used throughout the SWCAD-JS system.


<br/>

### CALCS

Math calculations and basic JSCAD operations.

### calcs.geometry

Geometric calculations in 2D/3D space.

![swcad-js demo - points in area](./static/img/calcs-area-points.jpg "swcad-js demo - points in area")

### calcs.geometry.points

Calculations around sets of co-ordinate points in 2D/3D space.

![swcad-js demo - point centroid](./static/img/calcs-centroid.jpg "swcad-js demo - point centroid")

### calcs.geometry.reinforcement

Calculations for reinforcement lines within a shape.

### calcs.math

Various math calculations.

### calcs.position

Functions leveraging JSCAD to get position data or move 2D/3D geometries.

### calcs.transform

Functions leveraging JSCAD to transform 2D/3D geometries.

![swcad-js demo - bisect](./static/img/calcs-transform-bisect.png "swcad-js demo - bisect")

![swcad-js demo - circular slice](./static/img/calcs-transform-slice.jpg "swcad-js demo - circular slice")

![swcad-js demo - cut/clone quadrant](./static/img/calcs-transform-2d.jpg "swcad-js demo - cut/clone quadrant")

![swcad-js demo - stack](./static/img/calcs-transform-stack.jpg "swcad-js demo - stack")

<br/>

### PROFILES

Modelling functions that generate 2D geometries.

### profiles.beadsBits

Modelling functions that generate 2D beads (basic shapes mainly for additive `hull` functions) and bits (basic shapes for subtractive `hull` functions).

### profiles.beadsBits.corner

Modelling functions that generate 2D shapes which emulate woodworking router bits.

![swcad-js demo - 2d bits](./static/img/profiles-bits-2d.jpg "swcad-js demo - 2d bits")

### profiles.connections

Modelling functions that generate connecting and interlocking 2D parts.

![swcad-js demo - connections 1](./static/img/profiles-connections-1.jpg "swcad-js demo - connections 1")

![swcad-js demo - connections 2](./static/img/profiles-connections-2.png "swcad-js demo - connections 2")

### profiles.connections.jointPanel

Modelling functions that generate connecting and interlocking 2D panels.

![swcad-js demo - joint panel (one-joint)](./static/img/profiles-connections-joint-panel-1.jpg "swcad-js demo - joint panel (one-joint)")

![swcad-js demo - joint panel (two-joint)](./static/img/profiles-connections-joint-panel-2.png "swcad-js demo - joint panel (two-joint)")

### profiles.mesh

Modelling functions that generate 2D perforated shapes.

![swcad-js demo - 2d mesh panel](./static/img/profiles-mesh-panel.jpg "swcad-js demo - 2d mesh panel")

### profiles.reinforcements

Modelling functions that generate 2D shapes for reinforcements.

![swcad-js demo - reinforced rect.](./static/img/profiles-reinforcement-rect.jpg "swcad-js demo - reinforced rect.")

### profiles.reinforcements.boxCurve

Modelling functions that generate curved 2D reinforcements for right-angle corners.

![swcad-js demo - box reinforcementt](./static/img/profiles-reinforcement-box.jpg "swcad-js demo - box reinforcementt")

### profiles.text

Modelling functions that generate 2D text.

![swcad-js demo - 2d text](./static/img/profiles-text.jpg "swcad-js demo - 2d text")

<br/>

### COMPONENTS

Modelling functions that generate 3D geometries.

### components.beadsBits

Modelling functions that generate 3D beads (basic shapes mainly for additive `hull` functions) and bits (basic shapes for subtractive `hull` functions).

![swcad-js demo - 3d beads](./static/img/components-beads.png "swcad-js demo - 3d beads")

### components.beadsBits.corner

Modelling functions that generate 3D geometries which emulate woodworking router bits.

![swcad-js demo - 3d bits](./static/img/components-bits-3d.png "swcad-js demo - 3d bits")

### components.fittings

Modelling functions that generate 3D fittings that integrate with round/rectangular profiles (dowels, dimensional lumber, etc).

![swcad-js demo - fittings](./static/img/components-fittings.jpg "swcad-js demo - fittings")

### components.mesh

Modelling functions that generate perforated 3D shapes.

![swcad-js demo - mesh panel](./static/img/components-mesh-panel.jpg "swcad-js demo - mesh panel")

### components.reinforcements

Modelling functions that generate 3D reinforcements.

![swcad-js demo - reinforced joist](./static/img/components-reinforcements-joist.jpg "swcad-js demo - reinforced joist")

![swcad-js demo - reinforced panel](./static/img/components-reinforcements-rect.jpg "swcad-js demo - reinforced panel")

### components.reinforcements.boxSupport

Modelling functions that generate curved 3D reinforcements for right-angle corners.

![swcad-js demo - box reinforcement](./static/img/components-reinforcements-box.jpg "swcad-js demo - box reinforcement")

### components.routedShapes

Modelling functions that generate 3D geometries which have been "routed" with bits from `components.beadsBits.corner`.

![swcad-js demo - routed shapes](./static/img/components-routed-shapes.png "swcad-js demo - routed shapes")

### components.text

Modelling functions that generate 3D text.

![swcad-js demo - 3d text](./static/img/components-text.jpg "swcad-js demo - 3d text")
