const fs = require('fs')
const path = require('path')
const {performance} = require('perf_hooks')

const {minify} = require('html-minifier-terser')
const PrettyError = require('pretty-error')
const pe = new PrettyError()

const minifierOptions = require('../config/html-minifier-options')
const stats = require('./stats')
const errorHtml = fs.readFileSync(path.join(__dirname, '..', 'public/error.html'), {encoding: 'utf8'})

const cache = new Map()

const builtFile = './build/index.js'

async function render(req, res, next) {
    const startTime = performance.now()
    const timestamp = Date.now()
    if (req.method !== 'GET') return next()
    if (process.env.NODE_ENV === 'production' && cache.has(req.url))
        return res.send(cache.get(req.url))

    let htmlString
    const status = {
        _404: false
    }
    try {
        const html = require(path.join('..', builtFile))?.default(req.url, status)

        htmlString = '<!DOCTYPE html>'
        htmlString += await minify(html, minifierOptions)
        htmlString += "<!--\n\n/\\\n |\\~~|\n | \\ |\n |___|\n\n-->"
    } catch (err) {
        const renderedError = pe.render(err);
        console.log(renderedError); // todo: log in file
        htmlString = errorHtml
        res.status(500)
    }
    if (status._404)
        res.status(404)
    res.send(htmlString)
    cache.set(req.url, htmlString)
    const endTime = performance.now()
    stats.push({
        startTime, endTime, timestamp,
        url: req.url
    })
}

module.exports = {render, builtFile}
