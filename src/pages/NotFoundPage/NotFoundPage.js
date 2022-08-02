import {Fragment} from 'react'
import SearchBar from '../../elements/SearchBar'

import styles from './not-found-page.module.scss'

export default function NotFoundPage() {
    return (
        <main className={styles.page}>
            <h1>Nicht gefunden</h1>
            <p>Diese Seite gibt es nicht. Hier können Sie nach existierenden Dokumenten suchen:</p>
            <SearchBar/>
        </main>
    )
}
