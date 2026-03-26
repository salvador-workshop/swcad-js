"use strict"

/**
 * ...
 * @namespace families.paper
 */

const init = ({ lib, swLib }) => {
    const { rectangle } = lib.primitives;
    const { standards } = swLib.core
    const { extras } = swLib.utils

    const metric = {}
    Object.entries(standards.paper.metric).forEach(([key, val]) => {
        const newKey = extras.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        metric[newKey] = rectangle({ size: val })
    })

    const imperial = {}
    const ansi = {}
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

    const cards = {}
    Object.entries(standards.paper.cards).forEach(([key, val]) => {
        const newKey = extras.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        cards[newKey] = rectangle({ size: val })
    })

    const bookmarks = {}
    Object.entries(standards.paper.bookmarks).forEach(([key, val]) => {
        const newKey = extras.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        bookmarks[newKey] = rectangle({ size: val })
    })

    const poster = {}
    Object.entries(standards.paper.poster).forEach(([key, val]) => {
        const newKey = extras.camelCase(key.replaceAll('_', ' ').toLocaleLowerCase())
        poster[newKey] = rectangle({ size: val })
    })

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
