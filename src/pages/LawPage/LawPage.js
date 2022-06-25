import {Fragment} from 'react'
import {useParams} from 'react-router-dom'

import Icon from '../../elements/Icon'

import routes from '../../../scraper/data/routes.json'
import styles from './law-page.module.scss'
import {cl} from '../../utils/classNames'

const laws = require.context('../../../scraper/data/laws/')

export default function LawPage() {
    const {law} = useParams()
    const lawData = laws(routes[law])

    lawData.state = lawData.state.map(text => [text, <br key={text}/>]).flat().slice(0, -1)
    lawData.footnote = lawData.footnote.replace(/(<br>|\s)+$/, '')

    return (
        <Fragment>
            <aside className={styles.tableOfContents}>

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
                {lawData.content.map(block => {
                    const headline = <Fragment>
                        {block.supTitle && <span className={styles.supTitle}>{block.supTitle}</span>}
                        <span>{block.title || block.heading}</span>
                    </Fragment>

                    return [
                        block.title && <h2 className={cl(styles.headline, styles.title)}>
                            {headline}
                        </h2>,
                        block.heading && <h3 className={cl(styles.headline, styles.heading)}>
                            {headline}
                        </h3>,
                        block.content?.map((paragraph, i) =>
                            paragraph.filter(v => !!v).length === 0
                                ? null
                                : <p key={i}>
                                    {paragraph.map((part, i) => {
                                        console.log(part)
                                        if (!part) return
                                        switch (part.type) {
                                            case 'text':
                                                if (part.content === '') return
                                                return <span key={i}>{part.content}</span>
                                        }
                                    })}
                                </p>
                        ),
                    ]
                })}
            </main>
        </Fragment>
    )
}
