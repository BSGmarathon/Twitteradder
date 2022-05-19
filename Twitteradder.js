//This files adds stuff from csv.csv into tweetData.json in the folder socialshit
const fs = require('fs');
const colors = require('colors/safe');
const csv = require('csv-parser');
var csvFilePath = './socialshit/csv.csv';
var jsonFilePath = './socialshit/tweetData.rep';
var jsonOutputPath = './socialshit/output-tweetData.rep';
var isGameMatch = 0;
var csvDB = []; //Will have gameNames on x+0, media on x+1 and twitter message on x+2
var dbCounter = 0;

var bigJson; //Entire JSON object

init();
setTimeout(function() {
  //This is the array structure
  // console.log(jsonObj[2].game); //Intro SMO Rayman
  // console.log(csvDB[2]); //SMO message Rayman

  checkGames();
  returnJSON();
}, 400);

function checkGames() { //This function writes the correct tweet text to the correct run
  for (var i = 0; i < Object.values(bigJson).length; i++) {
    isGameMatch = false; //isGameMatch checks if every game got something. If it stays false, it didn't get a tag.
    for (var j = 0; j < csvDB.length; j++) {
      try {
        if (Object.values(bigJson)[i].game == csvDB[j]) {
          Object.values(bigJson)[i].media = csvDB[j + 1];
          Object.values(bigJson)[i].content = csvDB[j + 2];
          console.log("Gave a description to " + Object.values(bigJson)[i].game);
          isGameMatch = true;
        }
      } catch (e) {}
    }
    if (!isGameMatch) {
      console.log("Didn't do shit for " + Object.values(bigJson)[i].game);
    }
  }
}

function init() { //Reads from tweetData.rep and csv.csv
  fs.readFile(jsonFilePath, function(err, data) { //Get JSON object
    if (err) {
      console.log("Make sure you have a folder called " + colors.yellow("socialshit") + ' with the files ' + colors.green("csv.csv") + ' & ' + colors.green("tweetData.rep") + ' in them.')
      throw err;
    }
    bigJson = JSON.parse(data);
  });

  fs.createReadStream(csvFilePath)
    .on('error', function(err) {
      console.log("Make sure you have a folder called " + colors.yellow("socialshit") + ' with the files ' + colors.green("csv.csv") + ' & ' + colors.green("tweetData.rep") + ' in them.')
      throw err;
    })
    .pipe(csv())
    .on('data', (row) => {
      if (dbCounter % 3 === 0) { //Every even number will be a game, and uneven number will be tags to the one before it.
        csvDB[dbCounter] = row.Game;
        dbCounter++;
        csvDB[dbCounter] = row.picture + '.png'
        dbCounter++;
      } else if (dbCounter % 3 === 2) {
        csvDB[dbCounter] = row.Twittertag;
        dbCounter++;
      }
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });

}


function returnJSON() {
  fs.writeFileSync(jsonOutputPath, JSON.stringify(bigJson), (err) => {
    if (err) throw err;
  });
  console.log('File exported to ' + jsonOutputPath);
}
