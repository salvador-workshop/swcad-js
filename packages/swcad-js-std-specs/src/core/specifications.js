"use strict"

/*
 * Vanilla JS doesn't have true enum support. But this gets us partially there:
 * const Direction = {
 *   Up: 'Up',
 *   Down: 'Down',
 *   Left: 'Left',
 *   Right: 'Right'
 * };
 */

/**
 * ...
 * @namespace core.specifications
 */

const planes = {
    xy: { id: 0, desc: 'XY plane' },
    xz: { id: 1, desc: 'XZ plane' },
    yz: { id: 2, desc: 'YZ plane' },
}

const axes = {
    x: { id: 0, desc: 'X axis' },
    y: { id: 1, desc: 'Y axis' },
    z: { id: 2, desc: 'Z axis' },
}

const axialDirections = {
    posX: { id: 0, desc: 'towards +X' },
    negX: { id: 1, desc: 'towards -X' },
    posY: { id: 2, desc: 'towards +Y' },
    negY: { id: 3, desc: 'towards -Y' },
    posZ: { id: 4, desc: 'towards +Z' },
    negZ: { id: 5, desc: 'towards -Z' },
}


// quadrants are numbered counter-clockwise, starting from positive X & Y
const quadrants = {
    i: { id: 0, desc: '+X, +Y' },
    ii: { id: 1, desc: '-X, +Y' },
    iii: { id: 2, desc: '-X, -Y' },
    iv: { id: 3, desc: '+X, -Y' },
}

// octants are numbered in "Gray code" order
const octants = {
    i: { id: 0, desc: '+X, +Y, +Z' },
    ii: { id: 1, desc: '-X, +Y, +Z' },
    iii: { id: 2, desc: '+X, -Y, +Z' },
    iv: { id: 3, desc: '-X, -Y, +Z' },
    v: { id: 4, desc: '+X, +Y, -Z' },
    vi: { id: 5, desc: '-X, +Y, -Z' },
    vii: { id: 6, desc: '+X, -Y, -Z' },
    viii: { id: 7, desc: '-X, -Y, -Z' },
}

// boxKeypoints: box corners, midpoints of edges, midpoints of box faces
const boxKeypoints = {
    internal0: { id: 26, desc: 'centre' },
    corner1: { id: 0, desc: 'corner (+X, +Y, +Z)' },
    corner2: { id: 1, desc: 'corner (+X, -Y, +Z)' },
    corner3: { id: 2, desc: 'corner (-X, -Y, +Z)' },
    corner4: { id: 3, desc: 'corner (-X, +Y, +Z)' },
    corner5: { id: 4, desc: 'corner (+X, +Y, -Z)' },
    corner6: { id: 5, desc: 'corner (+X, -Y, -Z)' },
    corner7: { id: 6, desc: 'corner (-X, -Y, -Z)' },
    corner8: { id: 7, desc: 'corner (-X, +Y, -Z)' },
    edge1: { id: 8, desc: 'midpoint of edge (X axis, +Y, +Z)' },
    edge2: { id: 9, desc: 'midpoint of edge (X axis, -Y, +Z)' },
    edge3: { id: 10, desc: 'midpoint of edge (X axis, -Y, -Z)' },
    edge4: { id: 11, desc: 'midpoint of edge (X axis, +Y, -Z)' },
    edge5: { id: 12, desc: 'midpoint of edge (Y axis, +X, +Z)' },
    edge6: { id: 13, desc: 'midpoint of edge (Y axis, -X, +Z)' },
    edge7: { id: 14, desc: 'midpoint of edge (Y axis, -X, -Z)' },
    edge8: { id: 15, desc: 'midpoint of edge (Y axis, +X, -Z)' },
    edge9: { id: 16, desc: 'midpoint of edge (Z axis, +X, +Y)' },
    edge10: { id: 17, desc: 'midpoint of edge (Z axis, +X, -Y)' },
    edge11: { id: 18, desc: 'midpoint of edge (Z axis, -X, -Y)' },
    edge12: { id: 19, desc: 'midpoint of edge (Z axis, -X, +Y)' },
    face1: { id: 20, desc: `centre of face (${axialDirections.posX.desc})` },
    face3: { id: 21, desc: `centre of face (${axialDirections.negX.desc})` },
    face2: { id: 22, desc: `centre of face (${axialDirections.posY.desc})` },
    face4: { id: 23, desc: `centre of face (${axialDirections.negY.desc})` },
    face5: { id: 24, desc: `centre of face (${axialDirections.posZ.desc})` },
    face6: { id: 25, desc: `centre of face (${axialDirections.negZ.desc})` },
}

const specifications = {
    planes,
    axes,
    axialDirections,
    boxKeypoints,
    quadrants,
    octants,
}

module.exports = specifications;
