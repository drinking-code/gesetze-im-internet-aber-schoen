import {Fragment} from 'react'
import {useParams} from 'react-router-dom'

import Icon from '../../elements/Icon'
import LawText from './LawText'

import routes from '../../../scraper/data/routes.json'
import styles from './law-page.module.scss'
import {cl} from '../../utils/classNames'
import {urlAnchor} from '../../utils/string-cases'
import Logo from '../../elements/Logo'

const laws = require.context('../../../scraper/data/laws/')

export default function LawPage() {
    const {law} = useParams()
    const lawData = laws(routes[law])

    lawData.state = lawData.state?.map(text => [text, <br key={text}/>]).flat().slice(0, -1)
    lawData.footnote = lawData.footnote?.replace(/(<br>|\s)+$/, '')

    const headingText = block => [block.supTitle, block.title || block.heading].join(' ')

    return (
        <Fragment>
            <aside className={styles.tableOfContents}>
                <Logo/>
                <ul>
                    {lawData.content.map((block, i) => {
                        let label = headingText(block)
                        const maxLength = 33

                        if (label.length > maxLength)
                            label = label.slice(0, maxLength - 1) + '…'

                        return <li key={label}>
                            <a href={`#${urlAnchor(headingText(block))}`}>
                                {label}
                            </a>
                        </li>
                    })}
                </ul>
            </aside>
            <main className={styles.main}>
                <h1 className={styles.title}>{lawData.title}</h1>
                <p>
                    <span className={styles.dateOfIssue}>Ausfertigungsdatum: {lawData.dateOfIssue}</span>
                    <Icon className={styles.arrow} icon={'arrow-right-long'}/>
                    <a href={lawData.original} rel={'noreferrer'} target={'_blank'}>
                        Text auf gesetze-im-internet.de
                    </a>
                </p>
                <details className={styles.info}>
                    <summary>Weitere Informationen</summary>
                    {lawData.fullTitle && <Fragment>
                        <span className={styles.key}>Vollzitat:</span>
                        <span>{lawData.fullTitle}</span>
                    </Fragment>}
                    {lawData.state && <Fragment>
                        <span className={styles.key}>Status:</span>
                        <span>{lawData.state}</span>
                    </Fragment>}
                    {lawData.footnote && <Fragment>
                        <span className={styles.key}>Fußnote:</span>
                        <pre dangerouslySetInnerHTML={{__html: lawData.footnote}}/>
                    </Fragment>}
                </details>
                <LawText data={lawData} headingText={headingText}/>
            </main>
        </Fragment>
    )
}
