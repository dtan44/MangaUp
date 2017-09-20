let fbApi = require('./fbApi')
let manga = require("../manga/manga").manga

function receivedMessage(event) {
    let senderID = event.sender.id
    let recipientID = event.recipient.id
    let timeOfMessage = event.timestamp
    let message = event.message
 
    console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage)
    console.log(JSON.stringify(message))

    let messageId = message.mid

    let messageFull = message.text.toLowerCase().split(" ")
    let messageAttachments = message.attachments

    let messageHead = null
    let messageText = null

    if (messageFull.length > 1) {
        messageText = messageFull.slice(1).reduce((a,b)=>a+" "+b,"").trim()
        messageHead = messageFull[0]
    }
    else {
        messageText = messageFull[0]
    }

    if (messageHead) {
        // If we receive a command, check command and reply back
        console.log(`1-${messageHead} and 2-${messageText}`)
        switch (messageHead) {
            case 'check':
                manga.checkManga(senderID, messageText)
                break
            case 'source':
                manga.sourceManga(senderID, messageText)
                break
            default:
                sendTextMessage(senderID, "Unknown Command: reply \"help\" for more commands")
                break
        }

    } else if (messageText) {

        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'manga':
                sendMangaMessage(senderID)
                break
            case 'help':
                sendTextMessage(senderID, "Available Commands:\ncheck (manga)\nsource (manga domain)\nsource options")
                break
            case 'source':
                manga.sourceManga(senderID, messageText)
                break
            default:
                sendTextMessage(senderID, messageText)
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received")
    } else {
        sendTextMessage(senderID, "Message Error")
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
                    template_type: "generic",
                    elements: [{
                        title: "MangaPanda",
                        subtitle: "Read Latest Manga",
                        item_url: "http://www.mangapanda.com/",               
                        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk2PUsbcI5Bp5kLFo4HLVeU_MPXaJqBPPSmF7x6B4wqyuON07mXaiRbd0",
                        buttons: [{
                        type: "web_url",
                        url: "http://www.mangapanda.com/",
                        title: "Open Web URL"
                        }, {
                        type: "postback",
                        title: "Call Postback",
                        payload: "Payload for second bubble",
                        }]
                    }, {
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
                    }]
                }
            }
        }
    }

    fbApi.callSendAPI(messageData);
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

    fbApi.callSendAPI(messageData)
}

module.exports.receivedMessage = receivedMessage
module.exports.sendMangaMessage = sendMangaMessage
module.exports.sendTextMessage = sendTextMessage


