"use strict"

/**
 * Builds positive mouldings and negative moulds for various 2D profiles.
 * @memberof components
 * @namespace moulding
 */

const mouldBuilder = ({ jscad, swLib }) => {
  const { measureBoundingBox } = jscad.measurements
  const { extrudeLinear, extrudeRotate } = jscad.extrusions
  const { union, intersect } = jscad.booleans
  const { rotate, align, translate, mirror } = jscad.transforms
  const { cuboid, cylinder } = jscad.primitives

  /**
   * Builds a cuboid with given 2D profile placed on one edge.
   * @memberof components.moulding
   * @instance
   * @param {Object} opts
   * @param {number[]} opts.size - size (x, y, z)
   * @param {string} opts.alignment - where to align when profile size differs from
   *     base cuboid ('top' | 'middle' | 'bottom'). Defaults to 'middle'
   * @param {geom2.Geom2} geomProfile - 2D positive cross-section profile
   * @since 0.12.0
   */
  const cuboidMouldingOneEdge = (opts, geomProfile) => {
    const profileBbox = measureBoundingBox(geomProfile);
    const profileSize = [
      profileBbox[1][0] - profileBbox[0][0],
      profileBbox[1][1] - profileBbox[0][1],
    ];

    const baseBlock = cuboid({
      size: [
        opts.size[0] - profileSize[0],
        opts.size[1], opts.size[2]
      ]
    });

    const edgeBlock = rotate(
      [Math.PI / 2, 0, 0],
      extrudeLinear(
        { height: opts.size[1] },
        geomProfile
      )
    );

    const baseBlockBbox = measureBoundingBox(baseBlock);
    const alignedEdgeBlock = align({
      modes: ['min', 'max', 'none'],
      relativeTo: baseBlockBbox[1]
    }, edgeBlock);

    return align(
      { modes: ['center', 'center', 'none'] },
      union(baseBlock, alignedEdgeBlock)
    );
  }

  /**
   * Positive moulding for a cuboid with the given 2D profile placed onto two opposing side edges.
   * @memberof components.moulding
   * @instance
   * @param {Object} opts
   * @param {number[]} opts.size - size (x, y, z)
   * @param {'x' | 'y'} opts.axis - string to specify which axis to place the profile on. Defaults to 'x'
   * @param {geom2.Geom2} geomProfile - 2D positive cross-section profile
   * @since 0.13.3
   */

  const cuboidMouldingTwoEdges = (opts, geomProfile) => {
    let returnBlock = null
    switch (opts.axis) {
      case 'y':
        // Y axis
        const yHalfSize = [opts.size[1] / 2, opts.size[0], opts.size[2]];
        const yHalfBlock = rotate(
          [0, 0, Math.PI / -2],
          cuboidMouldingOneEdge(
            { size: yHalfSize },
            geomProfile
          )
        );
        const yHalfBlockAdj = align({ modes: ['center', 'max', 'none'] }, yHalfBlock);
        const yBlock = union(
          yHalfBlockAdj,
          mirror({ normal: [0, 1, 0] }, yHalfBlockAdj)
        );
        returnBlock = yBlock
        break;
      case 'x':
      default:
        // X axis
        const xHalfSize = [opts.size[0] / 2, opts.size[1], opts.size[2]];
        const xHalfBlock = align(
          { modes: ['min', 'center', 'none'] },
          cuboidMouldingOneEdge({ size: xHalfSize }, geomProfile)
        );
        const xBlock = union(xHalfBlock, mirror({ normal: [1, 0, 0] }, xHalfBlock));
        returnBlock = xBlock
        break;
    }
    return returnBlock
  }

  /**
   * Positive moulding for a cuboid with the given 2D profile placed onto all the side edges.
   * @memberof components.moulding
   * @instance
   * @param {Object} opts
   * @param {number[]} opts.size - size (x, y, z)
   * @param {geom2.Geom2} geomProfile - 2D positive cross-section profile
   * @since 0.12.0
   */
  const cuboidMoulding = (opts, geomProfile) => {
    const xBlock = cuboidMouldingTwoEdges({
      size: opts.size,
      axis: 'x'
    }, geomProfile)

    const yBlock = cuboidMouldingTwoEdges({
      size: opts.size,
      axis: 'y'
    }, geomProfile)

    return intersect(xBlock, yBlock);
  }

  /**
   * Positive moulding for a cylinder with the given 2D profile placed onto the edge.
   * @memberof components.moulding
   * @instance
   * @param {Object} opts
   * @param {number} opts.radius - Cylinder radius.
   * @param {number} opts.height - Cylinder height.
   * @param {number} opts.segments - Cylinder height.
   * @param {geom2.Geom2} geomProfile - 2D positive cross-section profile
   * @since 0.12.0
   */
  const circularMoulding = (opts, geomProfile) => {
    const profileBbox = measureBoundingBox(geomProfile);
    const profileSize = [
      profileBbox[1][0] - profileBbox[0][0],
      profileBbox[1][1] - profileBbox[0][1]
    ];
    const baseCylRad = opts.radius - profileSize[0];
    // cylinder expanded by a tiny amount to ensure no gaps
    const baseCyl = cylinder({
      radius: baseCylRad + 0.05,
      height: opts.height
    });

    const adjProfile = translate([baseCylRad + profileSize[0] / 2], geomProfile);
    const edgeMoulding = extrudeRotate({ segments: opts.segments || 48 }, adjProfile);

    return union(baseCyl, edgeMoulding);
  }

  return {
    cuboidMouldingOneEdge,
    cuboidMouldingTwoEdges,
    cuboidMoulding,
    circularMoulding,
  }
}

module.exports = { init: mouldBuilder }