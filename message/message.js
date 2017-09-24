let fbApi = require('./fbApi')
let manga = require("../manga/manga").manga
let db = require('../database/db')

function receivedMessage(event) {
    let senderId = event.sender.id
    let recipientId = event.recipient.id
    let timeOfMessage = event.timestamp
    let message = event.message
 
    console.log("Received message for user %d and page %d at %d with message:", 
    senderId, recipientId, timeOfMessage)
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
                if (messageText == "all") {
                    manga.checkAll({id:senderId})
                }
                else {
                    manga.checkManga(senderId, messageText, manga.source)
                }
                break
            case 'source':
                manga.sourceManga(senderId, messageText, manga)
                break
            case 'save':
                manga.checkManga(senderId, messageText, manga.source, "save")
                break
            case 'delete':
                manga.checkManga(senderId, messageText, manga.source, "delete")
                break
            default:
                sendTextMessage(senderId, "Unknown Command: reply \"help\" for more commands")
                break
        }

    } else if (messageText) {

        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'manga':
                sendMangaMessage(senderId)
                break
            case 'help':
                sendTextMessage(senderId, "Available Commands:\ncheck (manga)\nsave (manga)\ndelete (manga)\nlist\nsource (manga domain)\nsource options")
                break
            case 'source':
                manga.sourceManga(senderId, messageText, manga)
                break
            case 'start':
                sendTextMessage(senderId, "Welcome to MangaUp!\nI believe in reading manga EVERYWHERE, even on facebook. Hope you enjoy my services :D")
                break
            case 'list':
                db.listAll({id:senderId})
                break
            case 'changesource':
                sendQuickResponseSource(senderId)
                break
            default:
                sendTextMessage(senderId, messageText)
        }
    } else if (messageAttachments) {
        sendTextMessage(senderId, "Message with attachment received")
    } else {
        sendTextMessage(senderId, "Message Error")
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

    fbApi.callSendAPI(messageTyping)
    fbApi.callSendAPI(messageData)
}

function sendQuickResponseSource(recipientId) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: `You are currently sourced from "${manga.source.name}"\nHere are your choices`,
            "quick_replies":[
              {
                "content_type":"text",
                "title":"MangaHere",
                "payload":"MANGAHERE",
              },
              {
                "content_type":"text",
                "title":"MangaPanda",
                "payload":"MANGAPANDA"
              }
            ]
        }
    }
    fbApi.callSendAPI(messageData)
}

module.exports.receivedMessage = receivedMessage
module.exports.sendMangaMessage = sendMangaMessage
module.exports.sendTextMessage = sendTextMessage


