function getStructuredText(node) {
    const ast = simplifiedAst(node)
    return astToSimpleJsonMarkup(ast)
}

function simplifiedAst(node) {
    const simplifiedNode = {
        tagName: node.tagName ?? '#text',
        children: Array.from(node.childNodes).map(simplifiedAst),
        style: node.style,
    }

    if (simplifiedNode.children.length === 0)
        delete simplifiedNode.children

    if (['TABLE', 'PRE'].includes(node.tagName)) {
        delete simplifiedNode.children
        simplifiedNode.html = node.outerHTML
    }

    if ([undefined, 'DT', 'NOTINDEXED'].includes(node.tagName))
        simplifiedNode.text = node.textContent

    return simplifiedNode
}

function astToSimpleJsonMarkup(ast) {
    function makeStyledJsonMarkupText(text, options = {}) {
        return {
            type: 'text',
            content: text,
            bold: options.bold ?? false,
            italic: options.italic ?? false,
            underline: options.underline ?? false,
        }
    }

    function makeStyledJsonMarkupList(ast) {
        const keys = ast.children
            .filter(child => child.tagName === 'DT')
            .map(child => child.text)
        const values = ast.children
            .filter(child => child.tagName === 'DD')
            .map(child => astToSimpleJsonMarkup(child.children[0]))
        return {
            type: 'list',
            content: keys.map((key, i) => {
                return {
                    enum: key,
                    value: values[i]
                }
            }),
        }
    }

    // ast is always a div (the "jurAbsatz")
    const {children} = ast

    if (ast.tagName === 'TABLE')
        return [{type: 'table', content: ast.html}]

    if (ast.tagName === '#text')
        return ast.text

    return children.map(child => {
        switch (child.tagName) {
            case 'NOTINDEXED':
            case '#text':
                return makeStyledJsonMarkupText(child.text)
            case 'SPAN':
                return makeStyledJsonMarkupText(child.children[0].text, {
                    bold: ['700', 'bold'].includes(child.style.fontWeight),
                    italic: child.style.fontStyle === 'italic',
                    underline: child.style.textDecoration === 'underline',
                })
            case 'PRE':
                return {type: 'pre', content: child.html}
            case 'DL':
                return makeStyledJsonMarkupList(child)
            case 'BR':
                return {type: 'break'}
            case 'TABLE':
                return {type: 'table', content: child.html}
        }
    })
}

module.exports = getStructuredText