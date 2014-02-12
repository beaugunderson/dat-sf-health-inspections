var Dat = require('dat');

var PORT = process.env.PORT || 8080;

function fetch() {
  console.log('Fetching...');
}

var dat = new Dat('./data', function ready(err) {
  if (err) {
    throw err;
  }

  dat.serve({ port: PORT }, function () {
    console.log('Listening on port %d', PORT);

    setInterval(fetch, 1000 * 60 * 60 * 24);
  });
});
