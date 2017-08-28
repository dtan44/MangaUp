// MangaUp index

const express = require('express')
const app = express()
const verifytkn = "thisisme"

app.set('port', (process.env.PORT || 5000))

app.get('/', function(request, response) {
    console.log(request.url)
    response.send('Hello World')
})

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === verifytkn) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
})

app.listen(app.get('port'), function(err) {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('Node app is running on port', app.get('port'))
})