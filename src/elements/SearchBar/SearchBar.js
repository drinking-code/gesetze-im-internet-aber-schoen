import {useState} from 'react'
import Icon from '../Icon'
import {cl} from '../../utils/classNames'

import styles from './search-bar.module.scss'

export default function SearchBar({className, value}) {
    const [inputValue, setInputValue] = useState(value)

    return (
        <form className={cl(styles.search, className)} action={'/suche'} method={'get'}>
            <Icon className={styles.searchIcon} icon={'magnifying-glass'}/>
            <input type={'search'} placeholder={'Suche'} name={'q'} value={inputValue} onChange={e => {
                setInputValue(e.target.value)
            }}/>
            <button type={'submit'} aria-label={'Suchen'}>
                <Icon className={styles.submitIcon} icon={'arrow-right'}/>
                Suchen
            </button>
        </form>
    )
}
