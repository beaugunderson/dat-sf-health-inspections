var Dat = require('dat');
var request = require('request');
var unzip = require('unzip');

var PORT = process.env.PORT || 8080;

var dat;

function fetch() {
  console.log('Fetching...');
  console.log(JSON.stringify({ 'started': new Date() }));

  request.get('https://extxfer.sfdph.org/food/SFBusinesses.zip')
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      if (entry.path === 'inspections.csv') {
        var writeStream = dat.createWriteStream({
          csv: true,
          primary: ['business_id', 'date'],
          hash: true
        });

        entry.pipe(writeStream);

        writeStream.on('error', function (err) {
          console.error('Error', err);
        });

        writeStream.on('close', function () {
          console.log(JSON.stringify({ 'finished': new Date() }));
        });
      } else {
        entry.autodrain();
      }
    });
}

dat = new Dat('./data', function ready(err) {
  if (err) {
    throw err;
  }

  dat.serve({ port: PORT }, function () {
    console.log('Listening on port %d', PORT);

    fetch();
  });
});
