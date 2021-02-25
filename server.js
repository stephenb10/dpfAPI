var express = require('express'),
  https = require('https'),
  app = express(),
  port = process.env.PORT || 3000,
  fs = require('fs'),
  os = require('os'),
  dgram = require('dgram'),
  expressWs = require('express-ws'),
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

var httpsServer = https.createServer(credentials, app);

wss = expressWs(app, httpsServer)
var routes = require('./api/routes/dpfRoutes');
routes(app);

app.ws('/update', (ws, req) => {
  ws.on('message', msg => {
    console.log(msg)
      ws.send(JSON.stringify({0: msg}))
  })

  ws.on('close', () => {
      console.log('WebSocket was closed')
  })
})


app.use('/frame', express.static('frame'))

exports.wss = wss.getWss('/update');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl.substring(1) + ' not found'})
});


const udpServer = dgram.createSocket('udp4');
const networkInterfaces = os.networkInterfaces()
console.log(networkInterfaces)
//const ip = networkInterfaces['wlan0'][0]['address']
const ip = '0.0.0.0'

udpServer.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  udpServer.close();
});

udpServer.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  udpServer.send(Buffer.from(ip), rinfo.port, rinfo.address, (err) => {
    if(err != null) {
      console.log("Error sending msg", err)
      udpServer.close();
    }

    console.log(`Replied with IP: ${ip}`)

  });
});

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`UDP disocvery listening ${address.address}:${address.port}`);
});

udpServer.bind(37020);

httpsServer.listen(3000);

console.log('Digital Photo Frame RESTful API server started on: ' + port);
