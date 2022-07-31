export default function markText(text, positions, innerTextLengthMap) {
    if (!text || text === '') return text
    if (!Array.isArray(positions)) return text
    innerTextLengthMap = innerTextLengthMap ?? new Map()
    if (typeof text === 'string')
        text = [text]

    if (typeof positions[0] !== 'number') {
        positions.forEach(p => {
            text = markText(text, p, innerTextLengthMap)
        })
    } else {
        let arrayIndex = 0
        let lengthToArrayIndex = 0

        while (arrayIndex) {
            const arraySection = text[arrayIndex]
            const arraySectionLength = typeof arraySection === 'string'
                ? arraySection.length
                : innerTextLengthMap.get(arraySection)
            lengthToArrayIndex += arraySectionLength
            if (lengthToArrayIndex) {
                lengthToArrayIndex -= arraySectionLength
                break
            }
            arrayIndex++
        }
        const markStart = positions[0] - lengthToArrayIndex
        const markEnd = markStart + positions[1] - 1

        const markedString = text[arrayIndex].substring(markStart, markEnd)
        if (markedString.length === 0)
            return text
        const markedElement = <mark key={arrayIndex}>{markedString}</mark>
        innerTextLengthMap.set(markedElement, markedString.length)
        text[arrayIndex] = [
            text[arrayIndex].substring(0, markStart),
            markedElement,
            text[arrayIndex].substring(markEnd),
        ]
        text = text.flat()
    }
    return text
}
