import lunr from 'lunr'
import lunrStemmerSupport from 'lunr-languages/lunr.stemmer.support'
import lunrDe from 'lunr-languages/lunr.de'
import {v4 as uuid} from 'uuid'
import lawsPaths from '../../../scraper/data/routes.json'
import {urlAnchor} from '../../utils/string-cases'

import fs from 'fs'
import path from 'path'

lunrStemmerSupport(lunr)
lunrDe(lunr)

function getKeyByValue(object, value) {
    for (const key in object) {
        if (!object.hasOwnProperty(key)) continue
        if (object[key] === value)
            return key
    }

    return false
}

export const idMap = new Map()
export const textOnlyLaws = {}

function createId(data) {
    const id = uuid()
    idMap.set(id, data)
    return id
}

const INDEX_CACHE_FILE_NAME = '.index'

const index = fs.existsSync(INDEX_CACHE_FILE_NAME)
    ? lunr.Index.load(JSON.parse(
        fs.readFileSync(INDEX_CACHE_FILE_NAME, {encoding: 'utf8'})
    ))
    : lunr(function () {
        this.use(lunr.de)
        this.ref('id')
        this.field('abbr', {boost: 100})
        this.field('title', {boost: 50})
        this.field('fullTitle')
        this.field('text')

        this.metadataWhitelist = ['position']

        Object.values(lawsPaths).forEach(lawName => {
            const lawPath = getKeyByValue(lawsPaths, lawName)
            if (!lawPath) return
            const fileName = path.join(__dirname, '..', 'scraper', 'data', 'laws', lawName)
            if (!fs.existsSync(fileName)) return
            const law = JSON.parse(
                fs.readFileSync(fileName, {encoding: 'utf8'})
            )

            this.add({
                id: createId({
                    type: 'law',
                    lawPath,
                }),
                abbr: law.abbr,
                title: law.title,
                fullTitle: law.fullTitle,
            })

            const textOnlyLaw = {
                abbr: law.abbr,
                title: law.title,
                fullTitle: law.fullTitle,
                content: []
            }

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

                this.add({
                    id: createId({
                        type: 'paragraph',
                        lawPath,
                        anchor: urlAnchor([block.supTitle, block.title || block.heading].join(' ')),
                        index
                    }),
                    text,
                })

                textOnlyLaw.content.push({
                    title: block.title,
                    heading: block.heading,
                    supTitle: block.supTitle,
                    text,
                })
            })

            textOnlyLaws[lawPath] = textOnlyLaw
        })
    })

fs.writeFileSync(INDEX_CACHE_FILE_NAME, JSON.stringify(index), {encoding: 'utf8'})

export default index
