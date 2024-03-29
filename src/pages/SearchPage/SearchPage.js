import fs from 'fs'
import path from 'path'

import {Fragment} from 'react'
import {useSearchParams} from 'react-router-dom'

import SearchBar from '../../elements/SearchBar'
import Logo from '../../elements/Logo/Logo'
import Item from '../../elements/ListItem'
import {makeIndex, idMap, TEXT_ONLY_LAWS_DIR} from './flexsearch-index'
import markText from './mark-text'
import truncateToMarked from './truncate-to-marked'
import {urlAnchor} from '../../utils/string'
import parseLawReference from '../../utils/parse-law-reference'
import findAnchorInLaw from '../../utils/find-anchor-in-law'

import styles from './search-page.module.scss'
import {cl} from '../../utils/classNames'

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const index = makeIndex()

    const directResult = parseLawReference(searchParams.get('q'))
    if (directResult.law && Array.from(Object.values(directResult.classifications)).length !== 0) {
        directResult.paragraph = findAnchorInLaw(directResult.law.path, directResult.classifications)
    }
    if (directResult.paragraph) {
        directResult.anchor = urlAnchor(
            [directResult.paragraph.supTitle, directResult.paragraph.title || directResult.paragraph.heading].join(' ')
        )
    }

    const results = index.search(searchParams.get('q'))
        .map(result =>
            result.result.map(singleResult => {
                return {
                    ...singleResult,
                    field: result.field
                }
            })
        ).flat().sort((a, b) => a.score - b.score)
    const printedIds = []

    return (
        <Fragment>
            <header className={styles.header}>
                <Logo className={styles.logo}/>
                <SearchBar className={styles.searchBar} value={searchParams.get('q')}/>
            </header>
            <ol className={styles.resultsList}>
                {directResult.paragraph && (() =>
                        <Item link={`/${directResult.law.url}#${directResult.anchor}`} subtitle={directResult.law.title}
                              title={[directResult.paragraph?.supTitle, directResult.paragraph?.heading].join(' ').trim()}
                              className={styles.directResult}
                        />
                )()}
                {results.map((result, i) => {
                    const {id} = result
                    // dedupe results
                    if (printedIds.includes(id)) return null
                    printedIds.push(id)
                    // console.log(id, result)
                    const location = idMap.get(id)
                    const firstQuery = result.query[0]
                    const positions = [0, firstQuery.length]
                    const law = JSON.parse(fs.readFileSync(
                        path.join(TEXT_ONLY_LAWS_DIR, location.lawPath + '.json'),
                        {encoding: 'utf8'}
                    ))
                    const paragraph = law.content[location.index]
                    const field = result.field
                    if (location.type === 'law') {
                        positions[0] = law[field].toLowerCase().indexOf(firstQuery)
                        return (
                            <Item key={`${result.ref}_${i}`} link={`/${location.lawPath}`} title={law.abbr}
                                  isFullLaw={true}>
                                {field === 'abbr'
                                    ? <span className={styles.fullTitle}>{law.title}</span>
                                    : <span className={styles.fullTitle}>{markText(law[field], positions)}</span>
                                }
                            </Item>
                        )
                    } else {
                        positions[0] = paragraph?.text.toLowerCase().indexOf(firstQuery)
                        const [text, markedPosition] = truncateToMarked(markText(paragraph?.text, positions))
                        return (
                            <Item key={`${result.ref}_${i}`} link={`/${location.lawPath}#${location.anchor}`}
                                  title={[paragraph?.supTitle, paragraph?.heading].join(' ').trim()}
                                  subtitle={law.abbr}>
                                    <span className={cl(
                                        styles.excerpt,
                                        [styles.sharpLeft, null, styles.sharpRight][markedPosition + 1]
                                    )}>
                                        {text}
                                    </span>
                            </Item>
                        )
                    }
                })}
            </ol>
        </Fragment>
    )
}
