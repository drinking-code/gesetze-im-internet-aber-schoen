import styles from '../pages/LawPage/law-page.module.scss'

class Section {
    constructor(id) {
        const headingNode = document.getElementById(id)
        if (!headingNode) return false
        this.listItem = document.querySelector(`[href='#${id}']`).parentElement
        this.firstElement = headingNode
        this.lastElement = headingNode
        while (this.lastElement.nextSibling && !['H2', 'H3'].includes(this.lastElement.nextSibling.tagName)) {
            this.lastElement = this.lastElement.nextSibling
        }
    }

    get top() {
        return this.firstElement.getBoundingClientRect().top
    }

    get bottom() {
        return this.lastElement.getBoundingClientRect().bottom
    }
}

let sections = []
const tableOfContents = document.querySelector('aside ul')

tableOfContents?.querySelectorAll('li a').forEach(link => {
    const section = new Section(link.href.replace(/^[^#]+?#/, ''))
    sections.push(section)
})

const mainElement = document.querySelector('main')
let oldSelected

function updateHighlight() {
    const center = window.innerHeight / 2
    const deltaToCenterOfClosestEdge = sections.map(section => {
        return Math.min(
            Math.abs(center - section.top),
            Math.abs(center - section.bottom),
        )
    })
    const activeSectionIndex = deltaToCenterOfClosestEdge.indexOf(Math.min(...deltaToCenterOfClosestEdge))
    const activeSection = sections[activeSectionIndex]

    if (oldSelected === activeSection) return
    oldSelected = activeSection
    tableOfContents.querySelectorAll('li').forEach(entry => {
        entry.classList.remove(styles.active)
    })
    activeSection.listItem.classList.add(styles.active)
}

updateHighlight()

mainElement?.addEventListener('scroll', updateHighlight, {passive: true})
mainElement?.addEventListener('resize', updateHighlight, {passive: true})
