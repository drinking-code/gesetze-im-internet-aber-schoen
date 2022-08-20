import lawsPaths from '../../scraper/data/routes.json'
import fs from 'fs'
import path from 'path'
import {TEXT_ONLY_LAWS_DIR} from '../pages/SearchPage/flexsearch-index'

const laws = Array.from(Object.entries(lawsPaths)).map(([lawUrl, lawPath]) => {
    const lawData = JSON.parse(fs.readFileSync(
        path.join(TEXT_ONLY_LAWS_DIR, lawPath),
        {encoding: 'utf8'}
    ))
    if (!lawData.abbr || lawData.abbr === '' || !lawData.title || lawData.title === '')
        return false
    return {
        url: lawUrl,
        path: lawPath,
        abbr: lawData.abbr,
        title: lawData.title,
    }
}).filter(v => v)

const classifications = {
    article: ['art', 'art.', 'artikel'],
    paragraph: ['§', 'par', 'par.', 'paragr', 'paragr.', 'paragraph', 'paragraf'],
    section: ['abs', 'abs.', 'absatz'],
    subsection: ['uabs', 'uabs.', 'unterabsatz'],
    letter: ['buchst', 'buchst.', 'lit', 'lit.', 'buchstabe'],
    annex: ['anl', 'anl.', 'anlage'],
}

export default function parseLawReference(string) {
    const tokens = string.toLowerCase().trim().replace(/\s+/, ' ').split(' ')
    let law
    const classifications = {}
    let currentClassification
    tokens.forEach(token => {
        const detectedLaw = isLawName(token)
        if (detectedLaw) {
            law = detectedLaw
            return
        }
        const detectedClassification = isClassification(token)
        if (detectedClassification) {
            currentClassification = detectedClassification
            return
        }
        if (currentClassification) {
            classifications[currentClassification] = isNumber(token)
            currentClassification += '_'
        }
    })
    return {
        law, classifications
    }
}

function isLawName(token) {
    for (const law of laws) {
        if (percentageMatch(law.abbr, token) > .8
            || percentageMatch(law.title, token) > .2) return law
    }
    return false
}

function percentageMatch(string, needle) {
    const start = string.toLowerCase().indexOf(needle.toLowerCase())
    if (start === -1) return 0
    return needle.length / string.length
}

function isClassification(token) {
    for (const classification in classifications) {
        if (!classifications.hasOwnProperty(classification)) continue
        if (classifications[classification].includes(token)) return classification
    }
    return false
}

function isNumber(token) {
    const parsedNumber = token.match(/([\divx]+)\s*([a-z]?)/)
    if (!parsedNumber) return false
    parsedNumber.shift()
    if (parsedNumber[0].match(/\d+/))
        parsedNumber[0] = Number(parsedNumber[0])
    else
        parsedNumber[0] = romanToInt(parsedNumber[0])
    return parsedNumber.slice(0, 2)
}

function romanToInt(number) {
    let digits = number.split('')
        .map(numeral => {
            return {
                i: 1,
                v: 5,
                x: 10,
            }[numeral]
        })
    let parsedNumber = 0
    let buffer = 0
    digits.forEach((digit, i) => {
        const lastDigit = i > 0 && digits[i - 1]
        if (lastDigit === digit || !lastDigit) {
            buffer += digit
        } else if (lastDigit < digit) {
            parsedNumber += digit - buffer
            buffer = 0
        } else if (lastDigit > digit) {
            parsedNumber += buffer
            buffer = digit
        }
    })
    parsedNumber += buffer
    return parsedNumber
}
