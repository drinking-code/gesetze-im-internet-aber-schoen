import {cl} from '../../utils/classNames'
import styles from '../../pages/SearchPage/search-page.module.scss'

export default function Item({link, isFullLaw, title, subtitle, children, className, headingClassName, headingSpanClassName, ...props}) {
    return (
        <li {...props}>
            <a href={link}>
                <article className={cl(styles.result, isFullLaw && styles.law, className)}>
                    <h2 className={cl(styles.resultHeading, headingClassName)}>
                        <span className={cl(styles.main, headingSpanClassName)}>{title}</span>
                        {subtitle && <span className={styles.appendix}>{subtitle}</span>}
                    </h2>
                    {children}
                </article>
            </a>
        </li>
    )
}
