if (location.pathname !== '/') {
    const linkCopiedMsg = document.querySelector('#link_copied_msg')?.content
    const linkIcon = document.querySelector('#anchor_icon')?.content
    if (linkIcon) {
        const headings = document.querySelectorAll('h2, h3')
        headings?.forEach(heading => {
            const icon = linkIcon?.cloneNode(true).childNodes[0]
            icon.addEventListener('click', () => {
                const url = new URL(location.href)
                url.hash = `#${heading.id}`
                navigator.clipboard.writeText(url.href)
                history.pushState({}, '', url)

                const msg = linkCopiedMsg.cloneNode(true).childNodes[0]
                heading.append(msg)
                msg.addEventListener('animationend', () => {
                    msg.remove()
                })
            })
            heading.append(icon)
        })
    }
}
