import Icon from '../Icon'

import styles from './search-bar.module.scss'

export default function SearchBar() {
    return (
        <form className={styles.search}>
            <Icon className={styles.searchIcon} icon={'magnifying-glass'}/>
            <input type={'search'} placeholder={'Suche'}/>
            <button type={'submit'} aria-label={'Suchen'}>
                <Icon className={styles.submitIcon} icon={'arrow-right'}/>
                Suchen
            </button>
        </form>
    )
}
