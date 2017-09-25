let cheerio = require('cheerio')
let cloudscraper = require('cloudscraper')
let message = require('../message/message')

// entry requirements: 
//      entry
function getUrl(url, entry, callback) {
    cloudscraper.get(url, function(error, response, html) {
        if(!error){
            $ = cheerio.load(html)
            callback($,entry)
        } else {
            console.log("Error: Bad URL Request")
            console.log(error)
            message.sendTextMessage(senderId, `Error: Bad Manga Request`)
        }
    })
}

module.exports.getUrl = getUrl