const request = require('request')
const PAGE_ACCESS_TOKEN = "****"

function callSendAPI(messageData) {
    request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: messageData
        },

        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let recipientId = body.recipient_id
                let messageId = body.message_id

                console.log("Successfully sent message with id %s to recipient %s", 
                messageId, recipientId)
            } else {
                console.error("Unable to send message.")
                console.error(response)
                console.error(error)
            }
        }
    )
}

module.exports.callSendAPI = callSendAPI