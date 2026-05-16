/**
 * Odd utilities
 * @memberof data
 * @namespace functions
 */

/**
 * Camel Case
 * @memberof data.functions
 * @param {string} str string with whitespace
 * @returns camel-case string
 */
const camelCase = (str) => {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

/**
 * Constant To Camel Case
 * @memberof data.functions
 * @param {string} str constant-style string (capitals w/ underscores)
 * @returns camel-case string
 */
const constantToCamelCase = (str) => {
    return camelCase(str.replaceAll('_', ' ').toLowerCase())
}

module.exports = {
    camelCase,
    constantToCamelCase
}
