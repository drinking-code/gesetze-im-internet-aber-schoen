import fs from 'fs'
import path from 'path'

import Logo from '../../elements/Logo'
import Item from '../../elements/ListItem'

import styles from './all-page.module.scss'
import searchStyles from '../SearchPage/search-page.module.scss'
import {cl} from '../../utils/classNames'

export const SCRAPER_DIR = path.join(__dirname, '..', 'scraper', 'data')
export const TEXT_ONLY_LAWS_DIR = path.join(SCRAPER_DIR, 'laws_text')

const routes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scraper/data/routes.json'), {encoding: 'utf8'}))
const letters = []
const firstLetterCode = 'a'.charCodeAt(0)
const alphabetSmallLetters = Array(26).fill('')
    .map((v, i) => String.fromCharCode(firstLetterCode + i))
    .join('')
const charOrdering = [...alphabetSmallLetters, ' ', '.', ...Array(10).fill('').map((a, i) => i.toString())]
const index = Array.from(Object.keys(routes))
    .map(route => {
        const law = JSON.parse(fs.readFileSync(
            path.join(TEXT_ONLY_LAWS_DIR, routes[route]),
            {encoding: 'utf8'}
        ))
        return {
            ...law, route,
            asciiAbbr: law.abbr
                ?.replace(/[äÄ]/, 'A')
                .replace(/[öÖ]/, 'O')
                .replace(/[üÜ]/, 'U')
        }
    })
    .filter(v => v.abbr)
    .sort((a, b) => {
        if (!a.abbr && b.abbr) return 100
        if (a.abbr && !b.abbr) return -100
        if (!a.abbr && !b.abbr) return 0
        let order = 0, i = 0
        while (order === 0 && i < 100) {
            const numA = charOrdering.indexOf(a.asciiAbbr[i]?.toLowerCase())
            const numB = charOrdering.indexOf(b.asciiAbbr[i]?.toLowerCase())
            order = numA - numB
            i++
        }
        return order
    })
    .map(law => {
        const firstLetter = law.asciiAbbr && law.asciiAbbr[0]
            .toUpperCase()
            .replace(/[^A-Z]/, '#')
        if (firstLetter && firstLetter !== letters[letters.length - 1]) {
            letters.push(firstLetter)
        }
        return (
            <Item key={law.route} link={`/${law.route}`} title={law.abbr} isFullLaw={true}
                  headingClassName={styles.unFancy}
                  headingSpanClassName={styles.unFancy}>
                <span className={searchStyles.fullTitle}>{law.title}</span>
            </Item>
        )
    })

const letterList = letters.map(letter => {
    return <li key={letter}>{letter}</li>
})

export default function AllPage() {
    return (
        <main className={styles.main}>
            <Logo className={styles.logo}/>
            <ol className={styles.letterAnchors}>
                {letterList}
            </ol>
            <ol className={cl(searchStyles.resultsList, styles.removeWrapperStyles)}>
                {index}
            </ol>
        </main>
    )
}
