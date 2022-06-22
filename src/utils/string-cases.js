export function kebabCase(string) {
    if (!string || typeof string !== 'string') return string
    return string
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
        .join('-')
        .toLowerCase();
}

export function camelCase(string) {
    if (!string || typeof string !== 'string') return string
    return string?.replace(/^\w|[A-Z]|\b\w|\s+/g, function (match, index) {
        if (+match === 0) return "";
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    }).replace(/-/g, '');
}
