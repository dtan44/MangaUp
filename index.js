// MangaUp index

//
// Constants
//
const express = require('express')
const bodyParser = require('body-parser')
const message = require('./message/message')
const postback = require('./postback')

const app = express()
const VERIFY_TOKEN = "****"

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
            let pageID = entry.id
            let timeOfEvent = entry.time

            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message) {
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

<<<<<<< HEAD
//
// Helper Functions
//
function receivedMessage(event) {
    let senderID = event.sender.id
    let recipientID = event.recipient.id
    let timeOfMessage = event.timestamp
    let message = event.message

    console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage)
    console.log(JSON.stringify(message))

    let messageId = message.mid

    let messageText = message.text
    let messageAttachments = message.attachments

    if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
        case 'generic':
        sendGenericMessage(senderID)
        break

        default:
            sendTextMessage(senderID, messageText)
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received")
    }
}

function sendMangaMessage(recipientId) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "manga",
                    elements: [{
                        title: "MangaHere",
                        subtitle: "Read Latest Manga",
                        item_url: "https://www.mangahere.com/",               
                        image_url: "http://cdn.marketplaceimages.windowsphone.com/v8/images/a356cfca-5729-4a98-9912-6a9d0cb39552?imageType=ws_icon_large",
                        buttons: [{
                        type: "web_url",
                        url: "https://www.mangahere.com/",
                        title: "Open Web URL"
                        }, {
                        type: "postback",
                        title: "Call Postback",
                        payload: "Payload for first bubble",
                        }],
                    }, {
                        title: "MangaPanda",
                        subtitle: "Your Hands, Now in VR",
                        item_url: "http://www.mangapanda.com/",               
                        image_url: "https://pbs.twimg.com/profile_images/448739275480129536/Na8El9Oc.jpeg",
                        buttons: [{
                        type: "web_url",
                        url: "http://www.mangapanda.com/",
                        title: "Open Web URL"
                        }, {
                        type: "postback",
                        title: "Call Postback",
                        payload: "Payload for second bubble",
                        }]
                    }]
                }
            }
        }
    }

    callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    }
=======

>>>>>>> 99a6998... Working Simple Bot




