var express = require('express'),
  https = require('https'),
  app = express(),
  port = process.env.PORT || 3000,
  fs = require('fs')
  bodyParser = require('body-parser'),
  privateKey  = fs.readFileSync('./keys/server.key', 'utf8'),
  certificate = fs.readFileSync('./keys/server.cert', 'utf8'),
  credentials = {key: privateKey, cert: certificate};


app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
app.use(bodyParser.json({ limit: '50mb'}));
app.use(bodyParser.raw({
  type: 'image/jpeg',
  limit: '50mb'
}))


var routes = require('./api/routes/dpfRoutes');
routes(app);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl.substring(1) + ' not found'})
});

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000);

console.log('Digital Photo Frame RESTful API server started on: ' + port);
