let request = require('request')
let cheerio = require('cheerio')
let message = require('../message/message')
let cloudscraper = require('cloudscraper')

MSOURCE = {
    mangapanda : "http://www.mangapanda.com/",
    mangahere: "http://www.mangahere.co/manga/"
}

let source = MSOURCE.mangapanda

function checkManga(senderID, manga) {
    let url = source+manga.replace(/-/g, '').replace(/ /g, "-").replace(/:/g,'')
    console.log("Request: "+url)
    cloudscraper.get(url, function(error, response, html) {
        if(!error){
            switch(source) {
                case MSOURCE.mangapanda:
                    mangaPandaExtract(html, senderID)
                    break
                case MSOURCE.mangahere:
                    mangaHereExtract(html, senderID)
                    break
                default:
                    message.sendTextMessage(senderID, `Error: Source Not Found`)
                    break
            }
        } else {
            console.log("Error: Bad URL Request")
            console.log(error)
            message.sendTextMessage(senderID, `Error: Bad Manga Request`)
        }
    })
}

function sourceManga(senderID, mangaSource) {
    console.log("Sourcing: "+mangaSource)
    switch(mangaSource) {
        case "options":
            message.sendTextMessage(senderID, `Sources Avaliable:\nmangapanda\nmangahere`)
            break
        case "mangapanda":
            source = MSOURCE.mangapanda
            message.sendTextMessage(senderID, `Source switched to mangapanda`)
            break
        case "mangahere":
            source = MSOURCE.mangahere
            message.sendTextMessage(senderID, `Source switched to mangahere`)
            break
        case "source":
            message.sendTextMessage(senderID, `Current Source: ${source}`)
            break
    }
}

function mangaPandaExtract(html, senderID) {
    $ = cheerio.load(html)
    let error = $("h1").first().text()
    let mangaName
    console.log("ERROR")
    console.log(error)
    if (error == "404 Not Found") {
        console.log("Error: Bad Manga Request")
        return null
    } else {
        mangaName = $('.aname').first().text().trim()
        console.log("CHECK")
        console.log(mangaName)
        let date = $("table#listing tr").last().children().next().text()
        let latestChapter = $("table#listing tr").last().find('a').attr('href')
        resMessage = `${mangaName}\nLast Updated: ${date}\n${MSOURCE.mangapanda}${latestChapter}`
        message.sendTextMessage(senderID, resMessage)
    }
}

function mangaHereExtract(html, senderID) {
    $ = cheerio.load(html)
    let error = $("div#error_404").first().text()
    console.log("ERROR")
    console.log(error)
    if (error) {
        console.log("Error: Bad Manga Request")
        return null
    } else {
        let mangaName
        mangaName = $('h1').first().text().trim().toLowerCase()
        console.log("CHECK")
        console.log(mangaName)
        let latest = $("div.detail_list ul").children().first()
        let date = latest.find('span.right').text()
        let latestChapter = latest.find('span.left a').text().trim().split(" ").slice(-1)[0]
        resMessage = `${mangaName}\nLast Updated: ${date}\n${MSOURCE.mangapanda}${latestChapter}`
        message.sendTextMessage(senderID, resMessage)
    }
}

manga = new Object()
manga.checkManga = checkManga
manga.sourceManga = sourceManga

module.exports.manga = manga
