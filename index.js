// MangaUp index

//
// Constants
//
const express = require('express')
const bodyParser = require('body-parser')
const message = require('./message/message')
const postback = require('./message/postback')

const app = express()
const VERIFY_TOKEN = "***"

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(request, response) {
    console.log(request.url)
    response.send('Hello World')
})

//
// Webhook Validation
//
app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VERIFY_TOKEN) {
            console.log("Validating webhook")
            res.status(200).send(req.query['hub.challenge'])
    } else {
        console.error("Failed validation. Make sure the validation tokens match.")
        res.sendStatus(403)          
    }  
})

//
// Messages Listening
//
app.post('/webhook', function (req, res) {
    let data = req.body
    console.log(data)
    // Make sure this is a page subscription
    if ((data) && (data.object === 'page')) {
        console.log("made it to loop")
        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
            let pageId = entry.id
            let timeOfEvent = entry.time

            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message && (!event.message.quick_reply)) {
                    message.receivedMessage(event)
                } else if (event.postback && (event.postback.payload=="START")) {
                    event.message = {"text":"start"}
                    message.receivedMessage(event)
                } else if (event.postback && (event.postback.payload=="SOURCE")) {
                    event.message = {"text":"changesource"}
                    message.receivedMessage(event)
                } else if (event.postback && (event.postback.payload=="ALL")) {
                    event.message = {"text":"check all"}
                    message.receivedMessage(event)
                } else if (event.postback && (event.postback.payload=="LIST")) {
                    event.message = {"text":"list"}
                    message.receivedMessage(event)
                } else if (event.message && (event.message.quick_reply.payload=="MANGAHERE")) {
                    event.message = {"text":"source mangahere"}
                    message.receivedMessage(event)
                } else if (event.message && (event.message.quick_reply.payload=="MANGAPANDA")) {
                    event.message = {"text":"source mangapanda"}
                    message.receivedMessage(event)
                } else if (event.postback) {
                    postback.receivedPostback(event)
                } else {
                    console.log("Webhook received unknown event: ", event)
                }
            })
        })

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
        res.sendStatus(200)
    }
})

//
// App Start
//
app.listen(app.get('port'), function(err) {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('Node app is running on port', app.get('port'))
})






