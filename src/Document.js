import {Fragment} from 'react'
import {Route, Routes, useLocation, useSearchParams} from 'react-router-dom'

import './style.scss'
import App from './App'
import styles from './pages/LawPage/law-page.module.scss'

import routes from '../scraper/data/routes.json'
import Icon from './elements/Icon'

const laws = require.context('../scraper/data/laws/')

import favicon32 from './assets/images/favicon-32.png'
import favicon64 from './assets/images/favicon-64.png'
import favicon256 from './assets/images/favicon-256.png'
import favicon512 from './assets/images/favicon-512.png'
import favicon1024 from './assets/images/favicon-1024.png'
import favicon2048 from './assets/images/favicon-2048.png'

export default function Document() {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    let lawData;
    try {
        lawData = laws(routes[location.pathname.replace(/\//g, '')])
    } catch (e) {
    }
    const title = [
        !!lawData && lawData.abbr,
        location.pathname === '/suche' ? searchParams.get('q') : null,
        'Gesetze im Internet; aber schön'
    ].filter(v => !!v).join(' - ')
    const description = lawData?.content[0].content[0][0].content
    const url = 'https://gesetze-im-internet-aber-schoen.info' + location.pathname
    return (
        <html lang={'de'}>
        <head>
            <meta charSet='utf-8'/>
            <meta name='viewport' content='width=device-width,initial-scale=1'/>
            <meta name='robots' content='index, follow'/>
            <title>{title}</title>
            <link rel={'stylesheet'} href={'/style.css'}/>
            <Routes>
                <Route path={'/suche'} exact element={<Fragment/>}/>
                <Route path={'/:law'} exact element={
                    <script src={'/script.js'} defer/>
                }/>
            </Routes>

            <link rel={'icon'} href={favicon32} type={'image/png'} sizes={'32x32'}/>
            <link rel={'icon'} href={favicon64} type={'image/png'} sizes={'64x64'}/>
            <link rel={'icon'} href={favicon256} type={'image/png'} sizes={'256x256'}/>
            <link rel={'icon'} href={favicon512} type={'image/png'} sizes={'512x512'}/>
            <link rel={'apple-touch-icon'} href={favicon256}/>
            <link rel={'apple-touch-icon'} sizes={'512x512'} href={favicon512}/>
            <link rel={'apple-touch-icon'} sizes={'1024x1024'} href={favicon1024}/>
            <link rel={'apple-touch-icon'} sizes={'2048x2048'} href={favicon2048}/>

            <meta name={'twitter:card'} content={'summary'}/>
            <meta property={'og:site_name'} content={title}/>
            <meta property={'og:locale'} content={'de_DE'}/>
            <meta property={'og:type'} content={'website'}/>
            <meta property={'og:title'} content={title}/>
            <meta name={'twitter:title'} content={title}/>
            <meta name={'description'} content={description}/>
            <meta property={'og:description'} content={description}/>
            <meta name={'twitter:description'} content={description}/>
            <link rel={'canonical'} href={url}/>
            <meta property={'og:url'} content={url}/>
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
