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

    return (
        <Fragment>
            <header className={styles.header}>
                <Logo className={styles.logo}/>
                <SearchBar className={styles.searchBar} value={searchParams.get('q')}/>
            </header>
            <ol className={styles.resultsList}>
                {index.search(searchParams.get('q'), {enrich: true}).map((result, i) => {
                    console.log(result)
                    /*const location = idMap.get(result.ref)
                    const metadata = result.matchData.metadata
                    const positions = Object.keys(metadata).map(term => {
                        const fieldName = Object.keys(metadata[term])[0]
                        return metadata[term][fieldName].position
                    })
                    const law = JSON.parse(fs.readFileSync(
                        path.join(TEXT_ONLY_LAWS_DIR, location.lawPath + '.json'),
                        {encoding: 'utf8'}
                    ))
                    const paragraph = law.content[location.index]
                    const field = Object.keys(metadata).map(term => {
                        return Object.keys(metadata[term])[0]
                    })[0]
                    if (location.type === 'law') {
                        return (
                            <li key={`${result.ref}_${i}`}>
                                <a href={`/${location.lawPath}`}>
                                    <article className={cl(styles.result, styles.law)}>
                                        <h2 className={styles.resultHeading}>
                                            <span className={styles.main}>{law.abbr}</span>
                                        </h2>
                                        {field === 'abbr'
                                            ? <span className={styles.fullTitle}>{law.title}</span>
                                            : <span className={styles.fullTitle}>
                                                {markText(law[field], positions)}
                                            </span>
                                        }
                                    </article>
                                </a>
                            </li>
                        )
                    } else {
                        const [text, markedPosition] = truncateToMarked(markText(paragraph?.text, positions))
                        return (
                            <li key={`${result.ref}_${i}`}>
                                <a href={`/${location.lawPath}#${location.anchor}`}>
                                    <article className={styles.result}>
                                        <h2 className={styles.resultHeading}>
                                            <span className={styles.main}>
                                                {[paragraph?.supTitle, paragraph?.heading].join(' ').trim()}
                                            </span>
                                            <span className={styles.appendix}>{law.abbr}</span>
                                        </h2>
                                        <span className={cl(
                                            styles.excerpt,
                                            [styles.sharpLeft, null, styles.sharpRight][markedPosition + 1]
                                        )}>{text}</span>
                                    </article>
                                </a>
                            </li>
                        )
                    }*/
                })}
            </ol>
        </Fragment>
    )
}
