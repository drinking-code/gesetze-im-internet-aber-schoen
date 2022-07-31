import styles from './logo.module.scss'
import {cl} from '../../utils/classNames'

export default function Logo({className}) {
    return (
        <a  className={cl(className, styles.logo)} href={'/'}>
            <h1>
                <span className={styles.bold}>GInet</span>;<span className={styles.italic}>aSö</span>
            </h1>
        </a>
    )
}
