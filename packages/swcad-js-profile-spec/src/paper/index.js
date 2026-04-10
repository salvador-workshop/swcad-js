"use strict"

/**
 * ...
 * @memberof profiles
 * @namespace paper
 */

const init = ({ jscad, swcadJs }) => {
    const { rectangle } = jscad.primitives;
    const { standards } = swcadJs.core
    const { extras } = swcadJs.utils

    /**
     * Metric paper sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const metric = {}
    Object.entries(standards.paper.metric).forEach(([key, val]) => {
        const newKey = extras.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
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
    Object.entries(standards.paper.imperial).forEach(([key, val]) => {
        if (key === 'ansi') {
            Object.entries(val).forEach(([aKey, aVal]) => {
                const ansiKey = extras.camelCase(aKey.replaceAll('_', ' ').toLocaleLowerCase())
                ansi[ansiKey] = rectangle({ size: aVal })
            })
        } else if (key === 'arch') {
            Object.entries(val).forEach(([arKey, arVal]) => {
                const archKey = extras.camelCase(arKey.replaceAll('_', ' ').toLocaleLowerCase())
                arch[archKey] = rectangle({ size: arVal })
            })
        } else {
            const newKey = extras.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
            imperial[newKey] = rectangle({ size: val })
        }
    })

    /**
     * Card paper sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const cards = {}
    Object.entries(standards.paper.cards).forEach(([key, val]) => {
        const newKey = extras.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        cards[newKey] = rectangle({ size: val })
    })

    /**
     * Bookmark sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const bookmarks = {}
    Object.entries(standards.paper.bookmarks).forEach(([key, val]) => {
        const newKey = extras.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        bookmarks[newKey] = rectangle({ size: val })
    })

    /**
     * Poster sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const poster = {}
    Object.entries(standards.paper.poster).forEach(([key, val]) => {
        const newKey = extras.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        poster[newKey] = rectangle({ size: val })
    })

    /**
     * Photo sizes
     * @type {Object}
     * @memberof profiles.paper
     */
    const photos = {}
    Object.entries(standards.paper.photos).forEach(([key, val]) => {
        const newKey = extras.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        photos[newKey] = rectangle({ size: val })
    })

    const paper = {
        metric,
        ansi,
        arch,
        imperial,
        cards,
        bookmarks,
        poster,
        photos,
    }

    return paper;
}

module.exports = { init };
