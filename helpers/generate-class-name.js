const crypto = require('crypto')

module.exports = function generateClassName(className, fileName) {
    if (className.startsWith('_')) return className
    const isGlobal = className.startsWith('global_')
    if (!fileName || isGlobal) fileName = ''
    if (isGlobal) className = className.replace(/^global_/, '')
    const prefix = isGlobal ? '_' : ''

    const hash = crypto.createHash('md5').update(fileName)
    let hashNumeric = parseInt(hash.copy().digest('hex'), 16)
    if (process.env.NODE_ENV !== 'production')
        return prefix + className + '_' + numberToAlphabetic(hashNumeric).substr(0, 8)

    hash.update(className)
    hashNumeric = parseInt(hash.digest('hex'), 16)
    return prefix + numberToAlphabetic(hashNumeric).substr(0, isGlobal ? 2 : 4)
}

function numberToAlphabetic(number) {
    // most stupid way to make the alphabet
    const firstLetterCode = 'a'.charCodeAt(0)
    const alphabetSmallLetters = Array(26).fill('')
        .map((v, i) => String.fromCharCode(firstLetterCode + i))
        .join('')
    const fullAlphabet = alphabetSmallLetters + alphabetSmallLetters.toUpperCase()

    // conversion
    const base = fullAlphabet.length
    let alphabetic = ''
    while (number > 0) {
        alphabetic += fullAlphabet[number % base]
        number = Math.floor(number / base)
    }
    return alphabetic
}
