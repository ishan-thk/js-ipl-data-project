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
        
    const matchesWonPerTeamPerYear = calculateMatchesWonPerTeamPerYear(matchesData)
    console.log('Matches won per Team per year:', matchesWonPerTeamPerYear)
    writeToJsonFile('matchesWonPerTeamPerYear.json', matchesWonPerTeamPerYear)

    
  })
})

function calculateMatchesWonPerTeamPerYear(matchesData) {
    var matchesWonPerTeamPerYear = {}

    matchesData.forEach((match) => {
      const year = match.season
      const winner = match.winner
  
      if (!matchesWonPerTeamPerYear[year]) {
        matchesWonPerTeamPerYear[year] = {}
      }
  
      if (!matchesWonPerTeamPerYear[year][winner]) {
        matchesWonPerTeamPerYear[year][winner] = 1
      } else {
        matchesWonPerTeamPerYear[year][winner]++
      }
    })
  
    return matchesWonPerTeamPerYear
}

function writeToJsonFile(filename, data) {
    fs.writeFile(`src/public/output/${filename}`, JSON.stringify(data), (err) => {
      if (err) throw err
      console.log(`${filename} has been saved.`)
    })
}