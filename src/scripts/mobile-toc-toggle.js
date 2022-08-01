import styles from '../pages/LawPage/law-page.module.scss'

const tocToggle = document.querySelector(`.${styles.toggle}`)
const toc = document.querySelector(`.${styles.tableOfContents} ul`)
tocToggle.addEventListener('click', toggleToc)
toc.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeToc)
)
window.addEventListener('touchstart', closeTocIfOutside)
window.addEventListener('mousedown', closeTocIfOutside)

function closeTocIfOutside(e) {
    if (e.target === tocToggle) return
    if (e.target === toc || e.target.parentNode === toc || e.target.parentNode.parentNode === toc) return
    closeToc()
}

function closeToc() {
    toc.classList.remove(styles.active)
}

function toggleToc() {
    toc.classList.toggle(styles.active)
}
