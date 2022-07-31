import lunr from 'lunr'
import lunrStemmerSupport from 'lunr-languages/lunr.stemmer.support'
import lunrDe from 'lunr-languages/lunr.de'
import {v4 as uuid} from 'uuid'
import lawsPaths from '../../../scraper/data/routes.json'

const laws = require.context('../../../scraper/data/laws/')

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

const index = lunr(function () {
    this.use(lunr.de)
    this.ref('id')
    this.field('title')
    this.field('fullTitle')
    this.field('text')

    this.metadataWhitelist = ['position']

    laws.keys().forEach(lawName => {
        const lawPath = getKeyByValue(lawsPaths, lawName)
        if (!lawPath) return
        const law = laws(lawName)
        this.add({
            id: createId({
                type: 'law',
                lawPath,
            }),
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

export default index
