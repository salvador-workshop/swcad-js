"use strict"

/**
 * ...
 * @memberof components
 * @namespace mesh
 */

//-----------
// TO-DO
//---------------------
// - Cylinders with rounded corners
//---------------------

const mesh3dInit = ({ jscad, swcadJs }) => {

    const { cuboid, cylinder, triangle, rectangle } = jscad.primitives
    const { translate, rotate, align, mirror } = jscad.transforms
    const { subtract, union } = jscad.booleans
    const { measureBoundingBox } = jscad.measurements
    const { extrudeRotate, extrudeLinear } = jscad.extrusions
    const { TAU } = jscad.maths.constants

    const {
        math,
    } = swcadJs.utils

    const {
        mesh: mesh2d
    } = swcadJs.profiles

    /**
       * Generates an edge flange profile
       * @param {string} type - "inset" or "offset"
       * @param {number} width 
       * @param {number} thickness 
       * @param {string[]} flipOpts - array of options for flipping ("vertical" or "horizontal")
       */
    const edgeFlange = (type = 'inset', width, thickness, flipOpts = []) => {
        let triangleAlignOpts = {}
        let triangleMirrorOpts = null
        let bearingSurfaceAlignOpts = {}
        let mirrorOpts = null

        const height = width * 2;

        if (type === 'inset') {
            triangleAlignOpts = { modes: ['max', 'min', 'center'], relativeTo: [0, 0, 0] }
            bearingSurfaceAlignOpts = { modes: ['max', 'max', 'center'], relativeTo: [0, 0, 0] }

            if (flipOpts.includes('vertical')) {
                triangleAlignOpts.modes = ['max', 'max', 'center']
                bearingSurfaceAlignOpts.modes = ['max', 'min', 'center']
                triangleMirrorOpts = { normal: [0, 1, 0], origin: [0, -height - thickness, 0] }
            }
        } else if (type === 'offset') {
            triangleAlignOpts = { modes: ['min', 'min', 'center'], relativeTo: [0, 0, 0] }
            bearingSurfaceAlignOpts = { modes: ['min', 'max', 'center'], relativeTo: [0, 0, 0] }
            mirrorOpts = { normal: [1, 0, 0] }

            if (flipOpts.includes('vertical')) {
                triangleAlignOpts.modes = ['max', 'max', 'center']
                bearingSurfaceAlignOpts.modes = ['max', 'min', 'center']
                triangleMirrorOpts = { normal: [0, 1, 0], origin: [0, -height - thickness, 0] }
            }
        } else {
            return null;
        }

        let triangleProfile = triangle({ type: 'SAS', values: [width, TAU / 4, height] });
        if (triangleMirrorOpts != null) {
            triangleProfile = mirror(triangleMirrorOpts, triangleProfile)
        }

        const triangleSection = align(
            triangleAlignOpts,
            triangleProfile
        )

        const bearingSurface = align(
            bearingSurfaceAlignOpts,
            rectangle({ size: [width, thickness] })
        )

        let finalShape = union(bearingSurface, triangleSection);
        if (mirrorOpts != null) {
            finalShape = mirror(mirrorOpts, finalShape)
        }

        return align({ modes: ['center', 'center', 'center'] }, finalShape)
    }

    /**
     * Builds a flat mesh panel model.
     * @memberof components.mesh
     * @param {*} opts 
     * @returns ...
     */
    const meshPanel = ({
        size,
        thickness = 1.333333,
        edgeMargin = math.inchesToMm(1/8),
        holeRadius,
        holeDistance,
        holePattern = 'tri',
    }) => {
        const mPanelProfile = mesh2d.meshPanel({
            size: [size[0], size[1]],
            edgeMargin,
            holeRadius,
            holeDistance,
            holePattern,
        })[0]

        const mPanel = extrudeLinear({ height: thickness }, mPanelProfile)

        return mPanel
    }

    /**
     * ...
     * @memberof components.mesh
     * @param {*} opts 
     * @returns ...
     * @deprecated
     */
    const meshCylinder = ({
        radius,
        height,
        segments = 16,
        thickness = 2,
        edgeMargin,
        edgeInsets = [0, 0],
        edgeOffsets = [0, 0],
        meshRadius,
        meshMinWidth,
        meshSegments = 16,
    }) => {
        const specs = {
            edgeMargin: edgeMargin || meshMinWidth
        }

        const baseCylinder = cylinder({ radius, height, segments });
        const cutCylinder = cylinder({ radius: radius - thickness, height: height + radius, segments });
        const baseShape = align(
            { modes: ['center', 'center', 'min'] },
            subtract(baseCylinder, cutCylinder)
        )
        const circumference = TAU * radius;

        let numPunches = 1;
        let circCtr = numPunches * meshRadius;
        while (circCtr < circumference) {
            circCtr += meshRadius * 2 + meshMinWidth;
            if (circCtr < circumference) {
                numPunches += 1
            }
        }

        const punches = []
        for (let idx = 0; idx < numPunches; idx++) {
            const currAngle = idx / numPunches * TAU
            punches.push(rotate([0, 0, currAngle], align(
                { modes: ['min', 'center', 'center'] },
                rotate(
                    [0, Math.PI / 2, 0],
                    cylinder({ radius: meshRadius, height: radius * 2, segments: meshSegments })
                )
            )))
        }

        let numPunchDiscs = 1;
        let htCtr = 0
        let remainingHt = height
        let discHeightInterval = (meshRadius * 2 + meshMinWidth) * 0.86603
        while (htCtr < height) {
            htCtr += discHeightInterval;
            if (htCtr < height) {
                numPunchDiscs += 1
                remainingHt -= discHeightInterval;
            }
        }

        const completePunch = align(
            { modes: ['center', 'center', 'min'], relativeTo: [0, 0, (specs.edgeMargin + remainingHt) / 2 * 0.86603] },
            union(...punches)
        )

        let reinforcedTube = baseShape;

        const hasInset = edgeInsets.some(insetVal => insetVal > 0)
        const hasOffset = edgeOffsets.some(offsetVal => offsetVal > 0)

        if (hasInset) {
            edgeInsets.forEach((insetWidth, idx) => {
                if (insetWidth === 0) {
                    return
                }
                const isTop = idx === 0;
                let sectionAlignOpts = {}
                let ringAlignOpts = {}
                const flipOpts = []
                if (isTop) {
                    sectionAlignOpts = { modes: ['min', 'min', 'max'], relativeTo: [0, 0, height], }
                    ringAlignOpts = { modes: ['center', 'center', 'max'], relativeTo: [0, 0, height], }
                    flipOpts.push('vertical')
                } else {
                    sectionAlignOpts = { modes: ['min', 'min', 'min'], relativeTo: [0, 0, 0], }
                    ringAlignOpts = { modes: ['center', 'center', 'min'], relativeTo: [0, 0, 0], }
                }
                const insetSection = align(
                    sectionAlignOpts,
                    edgeFlange('inset', insetWidth, 0.5, flipOpts)
                )
                const insetRing = align(
                    ringAlignOpts,
                    extrudeRotate({ segments }, translate([radius - thickness - insetWidth, 0, 0], insetSection))
                );

                reinforcedTube = union(reinforcedTube, insetRing)
            })
        }

        if (hasOffset) {
            edgeOffsets.forEach((offsetWidth, idx) => {
                if (offsetWidth === 0) {
                    return
                }
                const isTop = idx === 0;
                let sectionAlignOpts = {};
                let ringAlignOpts = {};
                const flipOpts = []
                if (isTop) {
                    sectionAlignOpts = { modes: ['min', 'min', 'max'], relativeTo: [0, 0, height], }
                    ringAlignOpts = { modes: ['center', 'center', 'max'], relativeTo: [0, 0, height], }
                    flipOpts.push('vertical')
                } else {
                    sectionAlignOpts = { modes: ['min', 'min', 'min'], relativeTo: [0, 0, 0], };
                    ringAlignOpts = { modes: ['center', 'center', 'min'], relativeTo: [0, 0, 0], };
                }
                const offsetSection = align(
                    sectionAlignOpts,
                    edgeFlange('offset', offsetWidth, 0.5, flipOpts)
                )
                const offsetRing = align(
                    ringAlignOpts,
                    extrudeRotate({ segments }, translate([radius, 0, 0], offsetSection))
                );

                reinforcedTube = union(reinforcedTube, offsetRing)
            })
        }

        let punchedTube = subtract(reinforcedTube, completePunch)
        for (let idx = 0; idx < numPunchDiscs - 1; idx++) {
            const zOffset = discHeightInterval * idx;
            let discRotation = [0, 0, 0]
            if (math.isOdd(idx)) {
                discRotation = [0, 0, TAU / (numPunches * 2)]
            }
            punchedTube = subtract(punchedTube, translate(
                [0, 0, zOffset],
                rotate(discRotation, completePunch))
            )
        }

        return punchedTube;
    }

    return {
        meshPanel,
        meshCylinder,
    }
}

module.exports = { init: mesh3dInit };
