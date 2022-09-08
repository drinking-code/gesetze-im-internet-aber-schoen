const path = require('path')
const fs = require('fs')

const app = require('express')()
const helmet = require('helmet')
const shrinkRay = require('shrink-ray-current')

require('./server/stats')
const sitemap = require('./server/sitemap')
const {render, builtFile} = require('./server/render')

if (process.env.DEPLOY_ENV === 'nginx')
    app.use(helmet({
        hsts: false
    }))
app.use(shrinkRay())

app.use((req, res, next) => {
    const allowedSuffixes = ['.css', '.map', 'script.js', '.ttf', '.woff2', '.png', '.ico', '.xml']
    const isAllowed = path =>
        allowedSuffixes.map(suffix => path.endsWith(suffix)).includes(true)

    if (req.method !== 'GET' || !isAllowed(req.path)) return next()

    const filePath = path.join(__dirname, 'build', req.path)
    if (!fs.existsSync(filePath)) {
        if (req.path === '/sitemap.xml')
            return next()
        return res.status(404).end()
    }

    res.sendFile(filePath)
})

app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.send("User-agent: *\nAllow: /")
})

app.get('/sitemap.xml', sitemap)

if (process.env.NODE_ENV === 'development') {
    fs.watchFile(builtFile, () => {
        // remove src/ from require cache
        console.log('delete cache')
        for (const modulePath in require.cache) {
            if (modulePath.startsWith(path.join(__dirname, 'build'))) {
                delete require.cache[modulePath]
            }
        }
    })
}

app.use(render)

const port = process.env.DEPLOY_ENV === 'nginx' ? process.env.PORT : 3001
app.listen(port)
