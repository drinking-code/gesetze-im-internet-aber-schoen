const path = require('path')
const fs = require('fs')
const {performance} = require('perf_hooks')

const app = require('express')()
const helmet = require('helmet')
const shrinkRay = require('shrink-ray-current')
const {minify} = require('html-minifier-terser')
const PrettyError = require('pretty-error')
const pe = new PrettyError()

const minifierOptions = require('./config/html-minifier-options')

if (process.env.DEPLOY_ENV === 'nginx')
    app.use(helmet({
        hsts: false
    }))
app.use(shrinkRay())

app.use((req, res, next) => {
    const allowedSuffixes = ['.css', '.map', 'script.js', '.ttf', '.woff2', '.png', '.ico']
    const isAllowed = path =>
        allowedSuffixes.map(suffix => path.endsWith(suffix)).includes(true)

    if (req.method !== 'GET' || !isAllowed(req.path)) return next()

    const filePath = path.join(__dirname, 'build', req.path)
    if (!fs.existsSync(filePath))
        return res.status(404).end()

    res.sendFile(filePath)
})

app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.send(`\
User-agent: *
Allow: /
`)
})

const cache = new Map()

let stats = []

app.use(async (req, res, next) => {
    const startTime = performance.now()
    if (req.method !== 'GET') return next()
    if (process.env.NODE_ENV === 'production' && cache.has(req.url))
        return res.send(cache.get(req.url))

    let htmlString
    const status = {
        _404: false
    }
    try {
        const html = require('./build/index.js')?.default(req.url, status)

        htmlString = '<!DOCTYPE html>'
        htmlString += await minify(html, minifierOptions)
        htmlString += "<!--\n\n/\\\n |\\~~|\n | \\ |\n |___|\n\n-->"
    } catch (err) {
        const renderedError = pe.render(err);
        console.log(renderedError);
        htmlString = 'Internal Error'
    } finally {
        if (process.env.NODE_ENV === 'development') {
            // remove src/ from require cache
            for (const modulePath in require.cache) {
                if (modulePath.startsWith(path.join(__dirname, 'build'))) {
                    delete require.cache[modulePath]
                }
            }
        }
    }
    if (status._404)
        res.status(404)
    res.send(htmlString)
    cache.set(req.url, htmlString)
    const endTime = performance.now()
    stats.push({
        startTime, endTime,
        url: req.url
    })
})

const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

setInterval(() => {
    const statsCopy = [...stats]
    stats = []
    const datetime = new Date();
    const filename = path.join(__dirname, 'logs', datetime.toISOString().slice(0, 10) + '.json')
    fs.writeFileSync(filename, JSON.stringify(statsCopy), {encoding: 'utf8'})
}, day)

const port = process.env.DEPLOY_ENV === 'nginx' ? process.env.PORT : 3001
app.listen(port)
