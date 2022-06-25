function getStructuredText(node) {
    const ast = simplifiedAst(node)
    const jsonMarkup = astToSimpleJsonMarkup(ast)
    return jsonMarkup
}

function simplifiedAst(node) {
    const simplifiedNode = {
        tagName: node.tagName ?? '#text',
        children: Array.from(node.childNodes).map(simplifiedAst),
        style: node.style,
    }

    if (simplifiedNode.children.length === 0)
        delete simplifiedNode.children

    if (node.tagName === 'TABLE') {
        delete simplifiedNode.children
        simplifiedNode.html = node.outerHTML
    }

    if ([undefined, 'DT'].includes(node.tagName))
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
            .map(child => child.children ? child.children[0].text : '')
        const values = ast.children
            .filter(child => child.tagName === 'DD')
            .map(child => astToSimpleJsonMarkup(child.children[0]))
        return {
            type: 'list',
            content: Object.fromEntries(keys.map((key, i) => [key, values[i]])),
        }
    }

    // ast is always a div (the "jurAbsatz")
    const {children} = ast
    console.log(ast)
    return children.map(child => {
        switch (child.tagName) {
            case '#text':
                return makeStyledJsonMarkupText(child.text)
            case 'SPAN':
                return makeStyledJsonMarkupText(child.children[0].text, {
                    bold: ['700', 'bold'].includes(child.style.fontWeight),
                    italic: child.style.fontStyle === 'italic',
                    underline: child.style.textDecoration === 'underline',
                })
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
