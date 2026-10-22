"use strict"

/**
 * Triangle calculations
 * @memberof calcs.position
 * @namespace triangle
 */

const geoTriangle = ({ jscad, swcadJs }) => {
    const { TAU } = jscad.maths.constants

    /**
     * Sets up triangle creation from the given parameters. If valid, returns triangle creation strategy (AAS, ASA, SAS, etc) and values for `jscad.primitives.triangle()`. If invalid, returns `null`
     * @param {object} opts 
     * @param {number} opts.hypot - hypotenuse
     * @param {number} opts.long - long side
     * @param {number} opts.short - short side
     * @param {number} opts.longAngle - long angle
     * @param {number} opts.shortAngle - short angle
     * @returns {{type: string, values: number[]}|null} - data for triangle creation
     */
    const rightTriangleOpts = ({
        hypot,
        long,
        short,
        longAngle,
        shortAngle,
    }) => {

        const isValueValid = (val) => {
            return typeof val == 'number' && val >= 0
        }

        const sides = { hypot, long, short }
        const angles = { longAngle, shortAngle }

        const validSides = Object.entries(sides).filter(([sideName, sideVal]) => {
            return isValueValid(sideVal)
        })
        const validAngles = Object.entries(angles).filter(([angleName, angleVal]) => {
            return isValueValid(angleVal)
        })

        if (validSides.length == 0 && validAngles.length == 0) {
            return null
        }

        const sideKeys = validSides.map(vSide => vSide[0]);
        const angleKeys = validAngles.map(vSide => vSide[0]);

        // follows JSCAD defaults
        let outType = 'SSS'
        let outValues = [1, 1, 1]

        if (validSides.length == 3) {
            outType = 'SSS'
            outValues = [short, hypot, long]
        } else if (sideKeys.includes('long') && sideKeys.includes('short')) {
            outType = 'SAS'
            outValues = [short, TAU / 4, long]
        } else if (sideKeys.includes('long') && angleKeys.includes('shortAngle')) {
            outType = 'AAS'
            outValues = [TAU / 4, shortAngle, long]
        } else if (sideKeys.includes('long') && angleKeys.includes('longAngle')) {
            outType = 'ASA'
            outValues = [TAU / 4, long, longAngle]
        } else if (sideKeys.includes('short') && angleKeys.includes('longAngle')) {
            outType = 'AAS'
            outValues = [TAU / 4, longAngle, short]
        } else if (sideKeys.includes('short') && angleKeys.includes('shortAngle')) {
            outType = 'ASA'
            outValues = [TAU / 4, short, shortAngle]
        } else if (sideKeys.includes('hypot') && angleKeys.includes('longAngle') && angleKeys.includes('shortAngle')) {
            outType = 'ASA'
            outValues = [longAngle, hypot, shortAngle]
        }

        return {
            type: outType,
            values: outValues,
        }
    }

    return {
        rightTriangleOpts,
    }
}

module.exports = { init: geoTriangle };
