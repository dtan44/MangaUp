let request = require('request')
let cheerio = require('cheerio')
let message = requre('../message/message')

function verifyManga(senderID, manga) {
    let url = "http://www.mangahere.co/manga/"+manga

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            let $ = cheerio.load(html)
            let title

            $('.title').filter(function(){
                let data = $(this);
                title = data.children().second().text()
            })

            console.log("Verified Manga Successfully")
            message.sendTextMessage(senderID, `Manga ${title} exists`)

        } else {
            console.log("Error: Bad Manga Request")
            message.sendTextMessage(senderID, `checking ${messageText}`)
        }
    }) 
}

module.exports.verifyManga = verifyManga
