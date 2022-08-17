import {Fragment} from 'react'
import {Route, Routes, useLocation, useSearchParams} from 'react-router-dom'

import './style.scss'
import App from './App'
import styles from './pages/LawPage/law-page.module.scss'

import routes from '../scraper/data/routes.json'
import Icon from './elements/Icon'

import fs from 'fs'
import path from 'path'

import favicon32 from './assets/images/favicon-32.png'
import favicon64 from './assets/images/favicon-64.png'
import favicon256 from './assets/images/favicon-256.png'
import favicon512 from './assets/images/favicon-512.png'
import favicon1024 from './assets/images/favicon-1024.png'
import favicon2048 from './assets/images/favicon-2048.png'
import {TEXT_ONLY_LAWS_DIR} from './pages/SearchPage/flexsearch-index'
import {escapeNonSlash} from './utils/string'

export default function Document({status}) {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    let notFound = false
    let lawData;
    try {
        const fileName = path.join(TEXT_ONLY_LAWS_DIR, routes[location.pathname.replace(/\//g, '')])
        if (fs.existsSync(fileName)) {
            lawData = fs.readFileSync(fileName, {encoding: 'utf8'})
            lawData = JSON.parse(lawData)
        }
    } catch (e) {
        notFound = true
    }

    const host = 'https://gesetze-im-internet-aber-schoen.info'
    const aboutPathEscaped = escapeNonSlash('/über')

    const title = [
        !!lawData && lawData.abbr,
        location.pathname === '/suche' && searchParams.get('q'),
        location.pathname === aboutPathEscaped && 'Über',
        !['/suche', aboutPathEscaped, '/'].includes(location.pathname) && notFound && 'Nicht gefunden',
        'Gesetze im Internet; aber schön'
    ].filter(v => !!v).join(' - ')

    if (lawData)
        lawData.content = lawData?.content?.filter(block => ![block.supTitle, block.title, block.heading].includes('Inhaltsübersicht'))
    const description = location.pathname === '/suche'
        ? ''
        : [aboutPathEscaped, '/'].includes(location.pathname)
            ? 'Alle Gesetze und Verordnungen aus gesetze-im-internet.de, aber mit verbessertem Design inklusive Dark-Mode.'
            : lawData?.content[0]?.text.substring(0, 150) ?? ''
    const url = host + location.pathname

    const LDJson = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": host,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": host + '/suche?q={search_term_string}'
            },
            "query-input": "required name=search_term_string"
        }
    }

    return (
        <html lang={'de'}>
        <head>
            <meta charSet='utf-8'/>
            <meta name='viewport' content='width=device-width,initial-scale=1'/>
            <meta name='robots' content='index, follow'/>
            <title>{title}</title>
            <link rel={'stylesheet'} href={'/style.css'}/>
            {!notFound && <script src={'/script.js'} defer/>}
            {location.pathname === '/' &&
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(LDJson)}}/>
            }

            <link rel={'icon'} href={favicon32} type={'image/png'} sizes={'32x32'}/>
            <link rel={'icon'} href={favicon64} type={'image/png'} sizes={'64x64'}/>
            <link rel={'icon'} href={favicon256} type={'image/png'} sizes={'256x256'}/>
            <link rel={'icon'} href={favicon512} type={'image/png'} sizes={'512x512'}/>
            <link rel={'apple-touch-icon'} href={favicon256}/>
            <link rel={'apple-touch-icon'} sizes={'512x512'} href={favicon512}/>
            <link rel={'apple-touch-icon'} sizes={'1024x1024'} href={favicon1024}/>
            <link rel={'apple-touch-icon'} sizes={'2048x2048'} href={favicon2048}/>

            {location.pathname !== '/suche' && <Fragment>
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
            </Fragment>}
        </head>
        <body>
        <App notFound={notFound} status={status}/>
        {!notFound &&
            <Fragment>
                <template id={'anchor_icon'}>
                    <Icon icon={'link'} className={styles.anchorIcon}/>
                </template>
                <template id={'link_copied_msg'}>
                    <div className={styles.linkCopiedMessage}>Link kopiert</div>
                </template>
            </Fragment>
        }
        </body>
        </html>
    )
}
