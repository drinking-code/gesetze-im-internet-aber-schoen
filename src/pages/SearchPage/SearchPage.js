import {Fragment} from 'react'
import {useSearchParams} from 'react-router-dom'

import SearchBar from '../../elements/SearchBar'
import Logo from '../../elements/Logo/Logo'
import {makeIndex, idMap, TEXT_ONLY_LAWS_DIR} from './flexsearch-index'
import markText from './mark-text'
import truncateToMarked from './truncate-to-marked'

import styles from './search-page.module.scss'
import {cl} from '../../utils/classNames'
import fs from 'fs'
import path from 'path'

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const index = makeIndex()

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

function Item({link, isFullLaw, title, subtitle, children}) {
    return (
        <li>
            <a href={link}>
                <article className={cl(styles.result, isFullLaw && styles.law)}>
                    <h2 className={styles.resultHeading}>
                        <span className={styles.main}>{title}</span>
                        {subtitle && <span className={styles.appendix}>{subtitle}</span>}
                    </h2>
                    {children}
                </article>
            </a>
        </li>
    )
}
