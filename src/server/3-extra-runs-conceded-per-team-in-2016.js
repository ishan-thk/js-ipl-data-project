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

        const extraRunsConcededPerTeamIn2016 = calculateExtraRunsConcededPerTeamIn2016()
        console.log('Extra runs conceded per team in 2016:', extraRunsConcededPerTeamIn2016)
        writeToJsonFile('extraRunsConcededPerTeamIn2016.json', extraRunsConcededPerTeamIn2016)

        // const outputPath = 'src/public/output/'
        // if(!fs.existsSync(outputPath)) {
        //     fs.mkdirSync(outputPath, {recursive: true})
        // }

    })
})

function calculateExtraRunsConcededPerTeamIn2016() {
    
    var extraRunsConcededPerTeamIn2016 = {}
    matchesData.forEach((match) => {
        deliveriesData.forEach((delivery) => {
            if(match.season === '2016' && match.id == delivery.match_id)
            {
                var team = delivery.bowling_team
                if(!extraRunsConcededPerTeamIn2016[team])
                {
                    extraRunsConcededPerTeamIn2016[team] = 0
                }
                extraRunsConcededPerTeamIn2016[team] += parseInt(delivery.extra_runs)
            }
        })
    })
    return extraRunsConcededPerTeamIn2016

}

function writeToJsonFile(filename, data) {
    fs.writeFile(`src/public/output/${filename}`, JSON.stringify(data), (err) => {
        if(err) throw err
        console.log(`${filename} has been saved.`)
    })
}