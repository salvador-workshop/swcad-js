"use strict"

/**
 * ...
 * @memberof components
 * @namespace crafts
 */

const init = ({ jscad, swcadJs }) => {
    const { rectangle, cuboid, triangle, circle, cylinder, roundedRectangle } = jscad.primitives;
    const { union, subtract } = jscad.booleans;
    const { translate, align, mirror, rotate } = jscad.transforms;
    const { hull } = jscad.hulls
    const { extrudeLinear, extrudeRotate } = jscad.extrusions
    const { TAU } = jscad.maths.constants

    const { standards } = swcadJs.data
    const { math, position } = swcadJs.calcs

    const toothpickSpecs = {
        radius: standards.crafts.DIAM_TOOTHPICK / 2,
        length: math.inchesToMm(4),
        pointLength: math.inchesToMm(1 / 4),
    }

    const bbqSkewerSpecs = {
        radius: standards.crafts.DIAM_BBQ_SKEWER / 2,
        length: math.inchesToMm(12),
        pointLength: math.inchesToMm(0.5),
    }

    const popsicleStickSpecs = {
        width: standards.crafts.POPSICLE_STICK_WIDTH,
        thickness: standards.crafts.POPSICLE_STICK_THICKNESS,
        length: standards.crafts.POPSICLE_STICK_LENGTH,
        endRadius: standards.crafts.POPSICLE_STICK_WIDTH / 2,
    }

    /**
     * Toothpick profile
     * @param {number} [radius] - Radius of the toothpick
     * @param {number} [length] - Length of the toothpick
     * @param {number} [pointLength] - Length of the pointed end of the toothpick
     * @returns {Geom2} Toothpick profile shape
     * @memberof components.crafts
     */
    const toothpickProfile = ({
        radius = toothpickSpecs.radius,
        length = toothpickSpecs.length,
        pointLength = toothpickSpecs.pointLength
    }) => {
        const core2d = rectangle({ size: [pointLength * -2 + length, radius * 2] })
        const core2dCoords = position.getGeomCoords(core2d)

        const pointTriangleSide = Math.hypot(radius, pointLength)
        const pointAngle = Math.atan(radius / pointLength) * 2
        const pointTriangle = triangle({ type: 'SSA', values: [radius * 2, pointTriangleSide, pointAngle] })

        const point2d1 = align(
            { modes: ['max', 'center', 'center'], relativeTo: [core2dCoords.left, 0, 0] },
            rotate([0, 0, TAU / 4], pointTriangle)
        )
        const point2d2 = align(
            { modes: ['min', 'center', 'center'], relativeTo: [core2dCoords.right, 0, 0] },
            rotate([0, 0, TAU / -4], pointTriangle)
        )
        const baseShape = rotate([0, 0, TAU / 4], union(core2d, point2d1, point2d2))
        return baseShape
    }

    /**
     * Toothpick model
     * @param {number} [radius] - Radius of the toothpick
     * @param {number} [length] - Length of the toothpick
     * @param {number} [pointLength] - Length of the pointed end of the toothpick
     * @returns {Geom3} Toothpick model
     * @memberof components.crafts
     */
    const toothpick = ({
        radius = toothpickSpecs.radius,
        length = toothpickSpecs.length,
        pointLength = toothpickSpecs.pointLength
    }) => {
        const baseShape = toothpickProfile({ radius, length, pointLength })

        return extrudeRotate({ segments: 12 }, baseShape)
    }

    /**
     * BBQ Skewer profile
     * @param {number} [radius] - Radius of the skewer
     * @param {number} [length] - Length of the skewer
     * @param {number} [pointLength] - Length of the pointed end of the skewer
     * @returns {Geom2} BBQ skewer profile
     * @memberof components.crafts
     */
    const bbqSkewerProfile = ({
        radius = bbqSkewerSpecs.radius,
        length = bbqSkewerSpecs.length,
        pointLength = bbqSkewerSpecs.pointLength
    }) => {
        const core2d = rectangle({ size: [length - pointLength, radius * 2] })
        const core2dCoords = position.getGeomCoords(core2d)

        const pointTriangleSide = Math.hypot(radius, pointLength)
        const pointAngle = Math.atan(radius / pointLength) * 2
        const pointTriangle = triangle({ type: 'SSA', values: [radius * 2, pointTriangleSide, pointAngle] })

        const point2d = align(
            { modes: ['min', 'center', 'center'], relativeTo: [core2dCoords.right, 0, 0] },
            rotate([0, 0, TAU / -4], pointTriangle)
        )

        const baseShape = rotate([0, 0, TAU / 4], union(core2d, point2d))
        return baseShape
    }

    /**
     * BBQ Skewer model
     * @param {number} [radius] - Radius of the skewer
     * @param {number} [length] - Length of the skewer
     * @param {number} [pointLength] - Length of the pointed end of the skewer
     * @returns {Geom3} BBQ skewer model
     * @memberof components.crafts
     */
    const bbqSkewer = ({
        radius = bbqSkewerSpecs.radius,
        length = bbqSkewerSpecs.length,
        pointLength = bbqSkewerSpecs.pointLength
    }) => {
        const baseShape = bbqSkewerProfile({ radius, length, pointLength })

        return extrudeRotate({ segments: 12 }, baseShape)
    }

    /**
     * Popsicle stick profile
     * @param {*} param0 
     * @param {number} [width] - Width of the stick
     * @param {number} [length] - Length of the stick
     * @param {number} [endRadius] - Radii of both ends of the stick
     * @returns {Geom2} Popsicle stick profile
     * @memberof components.crafts
     */
    const popsicleStickProfile = ({
        width = popsicleStickSpecs.width,
        length = popsicleStickSpecs.length,
        endRadius = popsicleStickSpecs.endRadius
    }) => {
        const ends = [
            align(
                { modes: ['min', 'center', 'center'], relativeTo: [length / -2, 0, 0] },
                roundedRectangle({ size: [width, width], roundRadius: endRadius - 0.01 })
            ),
            align(
                { modes: ['max', 'center', 'center'], relativeTo: [length / 2, 0, 0] },
                roundedRectangle({ size: [width, width], roundRadius: endRadius - 0.01 })
            ),
        ]
        const baseShape = hull(ends)
        return baseShape
    }

    /**
     * Popsicle stick
     * @param {*} param0 
     * @param {number} [width] - Width of the stick
     * @param {number} [thickness] - Thickness of the stick
     * @param {number} [length] - Length of the stick
     * @param {number} [endRadius] - Radii of both ends of the stick
     * @returns {Geom3} Popsicle stick
     * @memberof components.crafts
     */
    const popsicleStick = ({
        width = popsicleStickSpecs.width,
        thickness = popsicleStickSpecs.thickness,
        length = popsicleStickSpecs.length,
        endRadius = popsicleStickSpecs.endRadius
    }) => {
        const baseShape = popsicleStickProfile({ width, length, endRadius })

        return extrudeLinear({ height: thickness }, baseShape)
    }

    const crafts = {
        toothpickProfile,
        toothpick,
        bbqSkewerProfile,
        bbqSkewer,
        popsicleStickProfile,
        popsicleStick,
    }

    return crafts;
}

module.exports = { init };
