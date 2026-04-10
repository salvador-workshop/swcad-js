"use strict"

/**
 * ...
 * @memberof profiles
 * @namespace paper
 */

const init = ({ jscad, swcadJs }) => {
    const { rectangle } = jscad.primitives;
    const { functions } = swcadJs.data
    const { paper } = swcadJs.data.standards

    /**
     * Metric paper sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const metric = {}
    Object.entries(paper.metric).forEach(([key, val]) => {
        const newKey = functions.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        metric[newKey] = rectangle({ size: val })
    })

    /**
     * Imperial paper sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const imperial = {}
    /**
     * ANSI paper sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const ansi = {}
    /**
     * Architectural paper sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const arch = {}
    Object.entries(paper.imperial).forEach(([key, val]) => {
        if (key === 'ansi') {
            Object.entries(val).forEach(([aKey, aVal]) => {
                const ansiKey = functions.camelCase(aKey.replaceAll('_', ' ').toLocaleLowerCase())
                ansi[ansiKey] = rectangle({ size: aVal })
            })
        } else if (key === 'arch') {
            Object.entries(val).forEach(([arKey, arVal]) => {
                const archKey = functions.camelCase(arKey.replaceAll('_', ' ').toLocaleLowerCase())
                arch[archKey] = rectangle({ size: arVal })
            })
        } else {
            const newKey = functions.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
            imperial[newKey] = rectangle({ size: val })
        }
    })

    /**
     * Card paper sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const cards = {}
    Object.entries(paper.cards).forEach(([key, val]) => {
        const newKey = functions.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        cards[newKey] = rectangle({ size: val })
    })

    /**
     * Bookmark sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const bookmarks = {}
    Object.entries(paper.bookmarks).forEach(([key, val]) => {
        const newKey = functions.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        bookmarks[newKey] = rectangle({ size: val })
    })

    /**
     * Poster sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const poster = {}
    Object.entries(paper.poster).forEach(([key, val]) => {
        const newKey = functions.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        poster[newKey] = rectangle({ size: val })
    })

    /**
     * Photo sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const photos = {}
    Object.entries(paper.photos).forEach(([key, val]) => {
        const newKey = functions.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        photos[newKey] = rectangle({ size: val })
    })

    const outPaper = {
        metric,
        ansi,
        arch,
        imperial,
        cards,
        bookmarks,
        poster,
        photos,
    }

    return outPaper;
}

module.exports = { init };
