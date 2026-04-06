/**
 * Builds 2D mesh models.
 * @memberof profiles
 * @namespace mesh
 */

const mesh2dInit = ({ lib, swLib }) => {

    /**
     * Builds 2D mesh panel perforations (hole punch)
     * @memberof profiles.mesh
     * @returns ...
     */
    const meshPanelCutProfile = ({
        panelSize = 0,
        holeRadius = 0,
        holeDistance = 0,
        holePattern = '0',
    }) => {
        return null
    }

    /**
     * Builds a 2D mesh panel
     * @memberof profiles.mesh
     * @returns ...
     */
    const meshPanelProfile = ({
        size = 0,
        edgeMargin = 0,
        holeRadius = 0,
        holeDistance = 0,
        holePattern = '0',
    }) => {
        return null
    }

    return {
        meshPanelCutProfile,
        meshPanelProfile,
    };
}

module.exports = { init: mesh2dInit }