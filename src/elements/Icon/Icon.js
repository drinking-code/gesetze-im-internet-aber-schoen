import styles from './icon.module.scss'
import {cl} from '../../utils/classNames'
import {camelCase} from '../../utils/string-cases'

export default function Icon({icon, className, ...props}) {
    return <span {...props} className={cl(styles.icon, styles[camelCase(icon)], className)}/>
}
