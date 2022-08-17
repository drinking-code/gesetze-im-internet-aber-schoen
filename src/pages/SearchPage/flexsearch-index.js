import {Document} from 'flexsearch'
import lawsPaths from '../../../scraper/data/routes.json'
import {urlAnchor} from '../../utils/string'

import {randomBytes} from 'node:crypto'

import fs from 'fs'
import path from 'path'

function getKeyByValue(object, value) {
    for (const key in object) {
        if (!object.hasOwnProperty(key)) continue
        if (object[key] === value)
            return key
    }
    return false
}

function createId(data) {
    const id = uuid()
    idMap.set(id, data)
    return id
}

const INDEX_CACHE_FILE_NAME = '.index'
export const SCRAPER_DIR = path.join(__dirname, '..', 'scraper', 'data')
export const ID_MAP_FILE_NAME = path.join(SCRAPER_DIR, 'idMap.json')
export const TEXT_ONLY_LAWS_DIR = path.join(SCRAPER_DIR, 'laws_text')

export const idMap = fs.existsSync(ID_MAP_FILE_NAME)
    ? new Map(JSON.parse(
        fs.readFileSync(ID_MAP_FILE_NAME, {encoding: 'utf8'})
    ))
    : new Map()

const flexsearchIndex = new Document({
    cache: 100,
    language: 'de',
    document: {
        id: 'id',
        index: [{
            field: 'abbr'
        }, {
            field: 'title'
        }, 'fullTitle', 'text']
    }
})

let indexIsBuilt = false

export function makeIndex() {
    if (indexIsBuilt)
        return flexsearchIndex

    if (fs.existsSync(INDEX_CACHE_FILE_NAME)) {
        console.log('index file exists')
        const indexData = JSON.parse(
            fs.readFileSync(INDEX_CACHE_FILE_NAME, {encoding: 'utf8'})
        )
        for (const indexDataKey in indexData) {
            flexsearchIndex.import(indexDataKey, indexData[indexDataKey])
        }
        return flexsearchIndex
    }

    Object.values(lawsPaths).forEach(lawName => {
        const lawPath = getKeyByValue(lawsPaths, lawName)
        if (!lawPath) return
        const fileName = path.join(__dirname, '..', 'scraper', 'data', 'laws', lawName)
        if (!fs.existsSync(fileName)) return
        const law = JSON.parse(
            fs.readFileSync(fileName, {encoding: 'utf8'})
        )

        const textOnlyLaw = {
            abbr: law.abbr,
            title: law.title,
            fullTitle: law.fullTitle
        }
        flexsearchIndex.add({
            id: createId({
                type: 'law',
                lawPath,
            }),
            ...textOnlyLaw
        })

        textOnlyLaw.content = []
        law.content?.forEach((block, index) => {
            let text = ''

            function addToText(a) {
                if (!a) return
                if (Array.isArray(a)) {
                    a.forEach(addToText)
                } else if (a.type === 'text') {
                    text += a.content?.trim()
                } else if (a.text) {
                    text += a.text?.trim()
                }
            }

            addToText(block.content)

            flexsearchIndex.add({
                id: createId({
                    type: 'paragraph',
                    lawPath,
                    anchor: urlAnchor([block.supTitle, block.title || block.heading].join(' ')),
                    index
                }),
                text
            })
            textOnlyLaw.content.push({
                title: block.title,
                heading: block.heading,
                supTitle: block.supTitle,
                text,
            })
        })
    })

    console.log('built index')

    indexIsBuilt = true

    flexsearchIndex.export((key, data) => {
        const indexData = fs.existsSync(INDEX_CACHE_FILE_NAME)
            ? JSON.parse(fs.readFileSync(INDEX_CACHE_FILE_NAME, {encoding: 'utf8'}))
            : {}
        indexData[key] = data
        fs.writeFileSync(INDEX_CACHE_FILE_NAME, JSON.stringify(indexData), {encoding: 'utf8'})
    })
    fs.writeFileSync(ID_MAP_FILE_NAME, JSON.stringify(Array.from(idMap.entries())), {encoding: 'utf8'})

    return flexsearchIndex
}
