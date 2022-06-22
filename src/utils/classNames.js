export function cl(...classNames) {
    const classNamesArray = Array.from(classNames).filter(v => !!v)
    if (classNamesArray.length === 0)
        return null
    return classNamesArray.join(' ').trim()
}
