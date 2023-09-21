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
        
    const matchesPerYear = calculateMatchesPerYear(matchesData)
    console.log('Matches played per year:', matchesPerYear)
    writeToJsonFile('matchesPerYear.json', matchesPerYear)

  })
})

function calculateMatchesPerYear(matchesData) {
  const matchesPerYear = lodash.countBy(matchesData, 'season')
  var result = {}

  for (let year in matchesPerYear) {
    result[year] = matchesPerYear[year]
  }

  return result
}

function writeToJsonFile(filename, data) {
    fs.writeFile(`src/public/output/${filename}`, JSON.stringify(data), (err) => {
      if (err) throw err
      console.log(`${filename} has been saved.`)
    })
}