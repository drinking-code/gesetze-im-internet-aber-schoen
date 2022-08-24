const path = require('path')
const fs = require('fs')

let stats = []

const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

setInterval(() => {
    let statsCopy = [...stats]
    stats = []

    const datetime = new Date();
    const filename = path.join(__dirname, 'logs', datetime.toISOString().slice(0, 10) + '.json')
    if (fs.existsSync(filename)) {
        const existingStats = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}))
        statsCopy = existingStats.concat(statsCopy)
    }
    fs.writeFileSync(filename, JSON.stringify(statsCopy), {encoding: 'utf8'})
}, minute * 10)

module.exports = stats
