import styles from './logo.module.scss'
import {cl} from '../../utils/classNames'

export default function Logo({className}) {
    return (
        <a  className={cl(className, styles.logo)} href={'/'}>
            <h1>
                <span className={styles.bold}>GImInet</span>;<span className={styles.italic}>aSchö</span>
            </h1>
        </a>
    )
}
