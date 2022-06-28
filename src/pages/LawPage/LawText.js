import {Fragment} from 'react'
import {useLocation} from 'react-router-dom'

import styles from './law-page.module.scss'
import {cl} from '../../utils/classNames'
import {urlAnchor} from '../../utils/string-cases'

export default function LawText({data, headingText}) {
    data.content = data.content.map(block => {
        block.content = block.content?.map(paragraph => {
            let hadPart = false
            return paragraph?.filter((part, i) => {
                if (!part) return false
                if (part?.type === 'list') return true
                if (part?.type === 'break' && !hadPart) return false
                hadPart = true
                return part?.content?.replace(/[\s\u00A0]+/, '') !== ''
            })
        })
        return block
    })

    return data.content.map(block => {
        const headline = <Fragment>
            {block.supTitle && <span className={styles.supTitle}>{block.supTitle}</span>}
            {(block.title || block.heading) && <span>{block.title || block.heading}</span>}
        </Fragment>

        const heading = (() => {
            const id = urlAnchor(headingText(block))
            if (block.title)
                return <h2 className={cl(styles.headline, styles.heading)} id={id}>
                    {headline}
                </h2>
            else if ((block.heading || block.supTitle))
                return <h3 className={cl(styles.headline, styles.heading2)} id={id}>
                    {headline}
                </h3>
        })()

        function textFragment(part, i) {
            if (!part) return
            switch (part.type) {
                case 'text':
                    if (part.content === '') return
                    if (!part.bold && !part.italic && !part.underline)
                        return <Fragment key={i}>{part.content}</Fragment>
                    return <span key={i} style={{
                        fontWeight: part.bold && '700',
                        fontStyle: part.italic && 'italic',
                        textDecoration: part.underline && 'underline',
                    }}>{part.content}</span>
                case 'break':
                    return <br key={i}/>
                case 'table':
                    const lazyHasBorder = part.content.replace(/\s/g, '').includes('border-top:0.5ptsolid')
                    const lazyIsFullWidth = part.content.replace(/\s/g, '').includes('width="100%"')
                    return <table
                        className={cl(lazyHasBorder && styles.tableBorder, !lazyIsFullWidth && styles.autoWidth)}
                        key={i} dangerouslySetInnerHTML={{
                        __html: part.content
                            .replace(/^<table[^>]*?>/, '')
                            .replace(/<\/table>$/, '')
                            .replace(/border[^:]*?:[^;]+;/g, '')
                            .replace(/style="\s+/g, 'style="')
                            .replace(/\s*([:;])\s*/g, '$1')
                            .replace(/style="\s*"/g, '')
                            .replace(/ +/g, ' ')
                    }}/>
                case 'list':
                    return <dl key={i}>
                        {part.content.map(entry => [
                            <dt>{entry.enum}</dt>,
                            <dd>{entry.value.map(textFragment)}</dd>
                        ])}
                    </dl>
                case 'pre':
                    return <pre className={cl()} key={i} dangerouslySetInnerHTML={{
                        __html: part.content
                            .replace(/^<pre[^>]*?>/, '')
                            .replace(/<\/pre>$/, '')
                        // .replace(/border[^:]+?:[^;]+;/g, '')
                        // .replace(/style="\s+/g, 'style="')
                        // .replace(/\s*([:;])\s*/g, '$1')
                        // .replace(/style="\s*"/g, '')
                        // .replace(/ +/g, ' ')
                    }}/>
            }
        }

        return [
            heading,
            block.content?.map(paragraph =>
                paragraph.filter(v =>
                    !!v && v.type !== 'break'
                ).length === 0 ? null
                    : <div className={styles.paragraph}>
                        {paragraph.map(textFragment)}
                    </div>
            )
        ]
    })
}
