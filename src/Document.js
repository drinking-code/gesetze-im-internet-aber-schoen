import {Fragment} from 'react'
import {Route, Routes, useLocation, useSearchParams} from 'react-router-dom'

import './style.scss'
import App from './App'
import styles from './pages/LawPage/law-page.module.scss'

import routes from '../scraper/data/routes.json'
import Icon from './elements/Icon'

const laws = require.context('../scraper/data/laws/')

export default function Document() {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    let lawData;
    try {
        lawData = laws(routes[location.pathname.replace(/\//g, '')])
    } catch (e) {
    }
    return (
        <html lang={'de'}>
        <head>
            <meta charSet="utf-8"/>
            <title>{[
                !!lawData && lawData.abbr,
                location.pathname === '/suche' ? searchParams.get('q') : null,
                'Gesetze im Internet; aber schön'
            ].filter(v => !!v).join(' - ')}</title>
            <link rel={'stylesheet'} href={'/style.css'}/>
            <Routes>
                <Route path={'/suche'} exact element={<Fragment/>}/>
                <Route path={'/:law'} exact element={
                    <script src={'/script.js'} defer/>
                }/>
            </Routes>
        </head>
        <body>
        <App/>
        <template id={'anchor_icon'}>
            <Icon icon={'link'} className={styles.anchorIcon}/>
        </template>
        <template id={'link_copied_msg'}>
            <div className={styles.linkCopiedMessage}>Link kopiert</div>
        </template>
        </body>
        </html>
    )
}
