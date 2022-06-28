import {useLocation} from 'react-router-dom'

import './style.scss'
import App from './App'
import styles from './pages/LawPage/law-page.module.scss'

import routes from '../scraper/data/routes.json'
import Icon from './elements/Icon'

const laws = require.context('../scraper/data/laws/')

export default function Document() {
    const location = useLocation()
    let lawData;
    try {
        lawData = laws(routes[location.pathname.replace(/\//g, '')])
    } catch (e) {
    }
    return (
        <html lang={'de'}>
        <head>
            <meta charSet="utf-8"/>
            <title>{[!!lawData && lawData.abbr, 'Gesetze im Internet; aber schön'].join(' - ')}</title>
            <link rel={'stylesheet'} href={'/style.css'}/>
            <script src={'/script.js'} defer/>
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
