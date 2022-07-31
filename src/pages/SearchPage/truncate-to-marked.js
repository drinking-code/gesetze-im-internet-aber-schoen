/**
 * @param {Array|undefined} text
 * @return {[Array, number]} Array is the truncated text, number is 0 if the marked text is in the middle,
 *                           -1 if it is on the left side, and 1 if it is on the right side.
 * */
export default function truncateToMarked(text) {
    if (!text) return [text, 0]
    let firstMarkedIndex = 0
    while (typeof text[firstMarkedIndex] === 'string')
        firstMarkedIndex++
    let lastMarkedIndex = text.length - 1
    while (typeof text[lastMarkedIndex] === 'string')
        lastMarkedIndex--

    const lengthBeforeAndAfterMarked = 40
    const sectionBeforeFirstMarked = text[firstMarkedIndex - 1]

    text[firstMarkedIndex - 1] = sectionBeforeFirstMarked
        .substring(
            sectionBeforeFirstMarked.length - lengthBeforeAndAfterMarked,
            sectionBeforeFirstMarked.length
        )

    text[lastMarkedIndex + 1] = text[lastMarkedIndex + 1].substring(0, lengthBeforeAndAfterMarked)
    /**
     * @type Array
     * */
    text = text.slice(firstMarkedIndex - 1, lastMarkedIndex + 1 + 1)

    const positionMaxOffset = 3
    /**
     * @type number
     * */
    const markedPosition = typeof text[0] !== 'string' || text[0].length <= positionMaxOffset
        ? -1
        : (typeof text[text.length - 1] !== 'string'  || text[text.length - 1].length <= positionMaxOffset
                ? 1
                : 0
        )

    return [text, markedPosition]
}
