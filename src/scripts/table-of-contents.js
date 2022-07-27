class Section {
    constructor(id) {
        const headingNode = document.getElementById(id)
        this.listItem = document.querySelector(`[href=${id}]`).parentElement
        this.firstElement = headingNode
        this.lastElement = headingNode
        while (!['H2', 'H3'].includes(this.lastElement.nextSibling)) {
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

document.querySelectorAll('aside ul li').forEach(link => {
    const section = new Section(link.href.replace('#'))
})
