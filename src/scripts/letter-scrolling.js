import styles from '../pages/AllPage/all-page.module.scss'
import searchStyles from '../pages/SearchPage/search-page.module.scss'

const lettersList = document.querySelector(`.${styles.letterAnchors}`)
if (lettersList) {
    const allLawsList = document.querySelector(`.${searchStyles.resultsList}`)

    const firstOfLettersElements = Array.from(
        allLawsList.querySelectorAll('[data-letter]')
    )

    const letterMap = Object.fromEntries(
        firstOfLettersElements
            .map(element => [element.dataset.letter, element])
    )

    lettersList.addEventListener('mousedown', goToLetter)
    lettersList.addEventListener('mousedown', addMouseMove)
    document.addEventListener('mouseup', removeMouseMove)

    lettersList.addEventListener('touchstart', goToLetter)
    lettersList.addEventListener('touchmove', goToLetter)

    function addMouseMove() {
        lettersList.addEventListener('mousemove', goToLetter)
    }

    function removeMouseMove() {
        lettersList.removeEventListener('mousemove', goToLetter)
    }

    function goToLetter(e) {
        e.preventDefault()
        letterMap[e.target.innerText].scrollIntoView()
    }
}
