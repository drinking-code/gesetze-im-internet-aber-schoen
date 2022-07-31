import {Fragment} from 'react'
import {useSearchParams} from 'react-router-dom'

import SearchBar from '../../elements/SearchBar'
import index, {idMap, textOnlyLaws} from './lunr-index'
import markText from './mark-text'
import truncateToMarked from './truncate-to-marked'

import styles from './search-page.module.scss'
import {cl} from '../../utils/classNames'

const laws = require.context('../../../scraper/data/laws/')

export default function SearchPage() {
    const [searchParams] = useSearchParams()

    return (
        <Fragment>
            <header className={styles.header}>
                <SearchBar className={styles.searchBar} value={searchParams.get('q')}/>
            </header>
            <ol className={styles.resultsList}>
                {index.search(searchParams.get('q')).map((result, i) => {
                    const location = idMap.get(result.ref)
                    const metadata = result.matchData.metadata
                    const positions = Object.keys(metadata).map(term => {
                        const fieldName = Object.keys(metadata[term])[0]
                        return metadata[term][fieldName].position
                    })
                    // console.log(positions)
                    const law = textOnlyLaws[location.lawPath]
                    const paragraph = law.content[location.index]
                    // console.log(location)
                    const [text, markedPosition] = truncateToMarked(markText(paragraph?.text, positions))
                    return (
                        <li key={`${result.ref}_${i}`}>
                            <a href={`/${location.lawPath}`}> {/* todo: add anchor (or scroll down to excerpt) */}
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
                })}
            </ol>
        </Fragment>
    )
}
