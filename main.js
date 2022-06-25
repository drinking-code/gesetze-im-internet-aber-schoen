const path = require('path')

const app = require('express')()
const helmet = require('helmet')
const shrinkRay = require('shrink-ray-current')
const {minify} = require('html-minifier-terser')
const PrettyError = require('pretty-error')
const pe = new PrettyError()

const minifierOptions = require('./config/html-minifier-options')

// app.use(helmet())
app.use(shrinkRay())

app.use((req, res, next) => {
    const allowedSuffixes = ['.css', '.ttf', '.woff2']
    const isAllowed = path =>
        allowedSuffixes.map(suffix => path.endsWith(suffix)).includes(true)

    if (req.method !== 'GET' || !isAllowed(req.path)) return next()

    res.sendFile(path.join(__dirname, 'build', req.path))
})

app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next()

    let htmlString
    try {
        const html = require('./build/index.js')?.default(req.url)

        htmlString = await minify(html, minifierOptions)
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
    res.send(htmlString)
})

app.listen(3001)
