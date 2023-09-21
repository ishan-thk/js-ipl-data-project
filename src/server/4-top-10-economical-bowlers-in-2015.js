const fs = require('fs')
const csv = require('csv-parser')
const lodash = require('lodash')

const matchesData = []
const deliveriesData = []

fs.createReadStream('src/data/matches.csv')
.pipe(csv())
.on('data', (row) => {
    matchesData.push(row)
})
.on('end', () => {
    fs.createReadStream('src/data/deliveries.csv')
    .pipe(csv())
    .on('data', (row) => {
        deliveriesData.push(row)
    })
    .on('end', () => {

        const top10EconomicalBowlersIn2015 = calculateTop10EconomicalBowlersIn2015()
        console.log('Top 10 economical bowlers in 2015 are:', top10EconomicalBowlersIn2015)
        writeToJsonFile('top10EconomicalBowlersIn2015.json', top10EconomicalBowlersIn2015)

    })
})

function calculateTop10EconomicalBowlersIn2015 () {

    var bowlerStats = {}
    var economyOfBowlersIn2015 = {}
    
    matchesData.forEach((match) => {
        if(match.season === '2015') {
            deliveriesData.forEach((delivery) => {
                if(match.id == delivery.match_id) {
                    const bowler = delivery.bowler
                    const totalRuns = parseInt(delivery.total_runs - delivery.bye_runs - delivery.legbye_runs)

                    if(!bowlerStats[bowler]) {
                        bowlerStats[bowler] = { runs: 0, balls: 0 }
                    }

                    bowlerStats[bowler].runs += totalRuns
                    if(delivery.wide_runs=='0' && delivery.noball_runs=='0') {
                        bowlerStats[bowler].balls += 1
                    }
                }
            })   
        }
    })

    for(const bowler in bowlerStats) {
        const runs = bowlerStats[bowler].runs
        const balls = bowlerStats[bowler].balls
    
        const economyRate = (runs / (balls/6.0)).toFixed(2)
    
        economyOfBowlersIn2015[bowler] = parseFloat(economyRate)
    }



    var top10EconomicalBowlersIn2015 = Object.entries(economyOfBowlersIn2015)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 10)

    return top10EconomicalBowlersIn2015
}

function writeToJsonFile(filename, data) {
    fs.writeFile(`src/public/output/${filename}`, JSON.stringify(data), (err) => {
        if(err) throw err
        console.log(`${filename} has been saved.`)
    })
}