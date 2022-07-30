import {Fragment} from 'react'
import {useSearchParams} from 'react-router-dom'
import SearchBar from '../../elements/SearchBar'
import index, {idMap, textOnlyLaws} from './lunr-index'

const laws = require.context('../../../scraper/data/laws/')

import styles from './search-page.module.scss'

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
                    console.log(positions)
                    const law = textOnlyLaws[location.lawPath]
                    const paragraph = law.content[location.index]
                    return (
                        <li key={`${result.ref}_${i}`}>
                            <article>
                                <h2 className={styles.resultHeading}>
                                    {paragraph.heading}
                                    <span className={styles.appendix}>{law.abbr}</span>
                                </h2>
                                <span className={styles.excerpt}>{paragraph.text}</span>
                            </article>
                        </li>
                    )
                })}
            </ol>
        </Fragment>
    )
}
