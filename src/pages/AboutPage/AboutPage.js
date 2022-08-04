import {Fragment} from 'react'
import Logo from '../../elements/Logo'

import styles from './about-page.module.scss'

export default function AboutPage() {
    return (
        <main className={styles.main}>
            <Logo className={styles.logo}/>
            <h1>Über</h1>
            <p>Der fantastische Service "Gesetze im Internet" des Bundesministeriums der Justiz und des Bundesamts für
                Justiz stellt kostenlos Gesetze und Verordnungen bereit. Dennoch gibt es ein paar technische Probleme
                und Verbesserungsmöglichkeiten, die wir hier auf gesetze-im-internet-aber-schoen.info angehen möchten.
                Hier können Sie all die Gesetze und Verordnungen aus gesetze-im-internet.de ansehen, aber mit
                verbessertem Design inklusive Dark-Mode.</p>
            <p>gesetze-im-internet-aber-schoen.info ist in keiner Weise verbunden mit der Bundesregierung, dem
                Bundesministerium der Justiz, dem Bundesamt für Justiz, oder jeglichen anderen öffentlichen
                Institutionen.</p>
            <p>Es wird kein Anspruch auf Vollständigkeit und Ausschließlichkeit der Inhalte auf
                gesetze-im-internet-aber-schoen.info gestellt. Alle Inhalte dienen ausschließlich Informationszwecken.
                Die zur Verfügung gestellten Inhalte stellen keine Rechtsberatung dar.</p>
        </main>
    )
}
