const fs = require('fs')

const {JSDOM, ResourceLoader} = require('jsdom');
const ProgressBar = require('progress');
const getStructuredText = require('./get-structured-text')

const host = 'https://www.gesetze-im-internet.de'
const resourceLoader = new ResourceLoader({
    userAgent: `Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 (KHTML, like Gecko) gesetze-im-internet-aber-schoen.info/0.1 (Softdrink scraper)`,
});

function getHtmlVersionLink(dom) {
    const allElements = dom.window.document.querySelectorAll('*')
    const linkElement = Array.from(allElements).find(element => element.textContent === 'HTML')
    return linkElement.href
}

function getSectionDataFromHtml(html) {
    const headerOnly = !html.querySelector('.jnheader + div')
    const hasSupHeader = Array.from(html.querySelector('.jnheader h2, .jnheader h3').querySelectorAll('span'))
        .filter(span => span.textContent !== '').length > 1
    const isTitle = !!html.querySelector('.jnheader h2')

    const getCaption = () => {
        return (hasSupHeader
            ? html.querySelector(isTitle ? '.jnheader h2' : '.jnheader h3').querySelector('span:nth-of-type(2)')
            : html.querySelector(isTitle ? '.jnheader h2' : '.jnheader h3'))
            .textContent.trim().replace(/\s$/, '')
    }

    const data = {}
    data[isTitle ? 'title' : 'heading'] = getCaption()

    if (hasSupHeader)
        data.supTitle = html.querySelector('.jnheader h2, .jnheader h3').querySelector('span:nth-of-type(1)').textContent

    if (html.querySelector('.jnheader h2, .jnheader h3').querySelector('.jnentitel')?.textContent.trim() === '') {
        data.supTitle = data.heading ?? data.title
        delete data.heading
        delete data.title
    }

    if (!headerOnly) {
        // const jnhtml = html.querySelector('.jnheader + div .jnhtml')
        data.content = Array.from(html.querySelectorAll('.jnheader + div .jnhtml > div > *')).map(getStructuredText)
    }
    if (html.querySelector('.jnfussnote'))
        data.footnote = html.querySelector('.jnfussnote .jnhtml .jurAbsatz').textContent

    return data
}

async function scrapeLaws() {
    console.info('Scraping list of all laws...')

    const listListUrl = host + '/aktuell.html'
    const dom = await JSDOM.fromURL(listListUrl, {
        resources: resourceLoader,
    })
    const listUrlElements = dom.window.document.querySelectorAll('.alphabet')
    const listUrls = Array.from(listUrlElements).map(element => element.href)

    const routes = {}
    let lawUrls = []

    for (const listUrl of listUrls) {
        const dom = await JSDOM.fromURL(listUrl, {
            resources: resourceLoader,
        })
        const lawUrlElements = Array.from(dom.window.document.querySelectorAll('#paddingLR12 p'))
            .map(element => element.querySelector('a'))
        lawUrls = lawUrls.concat(
            Array.from(lawUrlElements).map(element => element.href)
        )

        break
    }

    console.info('Scraping all laws from list...')

    const bar = new ProgressBar('┆:bar┆ :percent :current/:total', {
        incomplete: '\u001b[90m█\u001b[0m',
        complete: '█',
        width: 60,
        total: lawUrls.length
    });

    let a = 0
    for (const lawUrl of lawUrls) {
        a++
        const dom = await JSDOM.fromURL(lawUrl, {
            resources: resourceLoader,
        })
        const htmlVersionLink = getHtmlVersionLink(dom)
        const htmlVersionDom = await JSDOM.fromURL(htmlVersionLink, {
            resources: resourceLoader,
        })
        const htmlVersionDocument = htmlVersionDom.window.document
        const titleElement = htmlVersionDocument.querySelector('.jnlangue')
        const fullTitleElement = htmlVersionDocument.querySelector('.jnzitat')
        const stateElement = htmlVersionDocument.querySelector('.standangaben')
        const footnoteElement = htmlVersionDocument.querySelector('.jnfussnote .jurAbsatz')
        const footnoteContent = footnoteElement.querySelector('pre')
            ? footnoteElement.querySelector('pre').innerHTML
            : footnoteElement.innerHTML

        const data = {
            original: lawUrl.replace(/index.html$/, ''),
            title: titleElement && titleElement.textContent.trim().replace(/\s$/, ''),
            abbr: titleElement && titleElement.parentNode.parentNode.querySelector('p').textContent,
            dateOfIssue: titleElement && titleElement.parentNode.parentNode.querySelector('p').nextSibling
                .textContent.replace('Ausfertigungsdatum: ', ''),
            fullTitle: fullTitleElement && fullTitleElement.querySelector(':nth-child(2)').textContent,
            state: stateElement && Array.from(stateElement.querySelectorAll('tbody tr td:nth-child(2)')).map(el => el.textContent),
            footnote: footnoteContent,
        }
        if (data.state && data.state.length === 0)
            data.state = [stateElement.textContent]

        const norms = Array.from(htmlVersionDocument.querySelectorAll('.jnnorm'))
        if (norms[0] && norms[0].title === 'Rahmen')
            norms.shift() // remove metadata
        if (norms[0] && norms[0].querySelector('h2, h3').textContent === 'Inhaltsübersicht')
            norms.shift() // remove table of contents

        data.content = []
        norms.forEach(norm =>
            data.content.push(getSectionDataFromHtml(norm))
        )

        const filePathStem = data.abbr.toLowerCase().replace(/[^a-z]/g, '')
        const filePath = `./data/laws/${filePathStem}.json`

        routes[data.original.replace(host, '').replace(/\//g, '')] = `./${filePathStem}.json`

        fs.writeFileSync(filePath, JSON.stringify(data))

        bar.tick();

        // if (a > 4) break
    }

    fs.writeFileSync('./data/routes.json', JSON.stringify(routes))
}

if (!fs.existsSync('./data/laws/'))
    fs.mkdirSync('./data/laws')

scrapeLaws()
