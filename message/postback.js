let message = require("./message")

function receivedPostback(event) {
  let senderID = event.sender.id
  let recipientID = event.recipient.id
  let timeOfPostback = event.timestamp

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  let payload = event.postback.payload

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback)

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  message.sendTextMessage(senderID, "Postback called")
}

module.exports.receivedPostback = receivedPostback
