import styles from './landing-page.module.scss'
import Icon from '../../elements/Icon'
import SearchBar from '../../elements/SearchBar'
import {Fragment} from 'react'

export default function LandingPage() {
    return (
        <Fragment>
            <main className={styles.page}>
                <h1 className={styles.title}>
                    <span>Gesetze im Internet</span>
                    <span className={styles.subtitle}>– aber schön</span>
                </h1>
                <SearchBar/>
            </main>
            <footer className={styles.footer}>
                <a href={'/über'}>
                    <Icon className={styles.icon} icon={'i-circle'}/>
                    Über
                </a>
                <a href={'https://www.gesetze-im-internet.de'} target={'_blank'} rel={'noreferrer'}>
                    <Icon className={styles.icon} icon={'bundesadler'}/>
                    gesetze-im-internet.de
                </a>
                <a href={'https://github.com/drinking-code/gesetze-im-internet-aber-schoen'} target={'_blank'} rel={'noreferrer'}>
                    <Icon className={styles.icon} icon={'github'}/>
                    GitHub
                </a>
            </footer>
        </Fragment>
    )
}
