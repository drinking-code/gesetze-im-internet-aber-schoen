import fs from 'fs'
import path from 'path'
import {TEXT_ONLY_LAWS_DIR} from '../pages/SearchPage/flexsearch-index'

export default function findAnchorInLaw(lawUrl, classifications) {
    if (!classifications.article && !classifications.paragraph) return false
    const directLaw = JSON.parse(fs.readFileSync(
        path.join(TEXT_ONLY_LAWS_DIR.replace('laws_text', 'laws'), lawUrl),
        {encoding: 'utf8'}
    ))
    const predictedSupTitle = (classifications.article
            ? 'Art '
            : classifications.paragraph
                ? '§ ' : '') +
        (classifications.article || classifications.paragraph)[0].toString()

    return directLaw.content.find(paragraph => {
        if (paragraph.supTitle === predictedSupTitle) return true
    })
}
