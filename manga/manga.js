let request = require('request')
let cheerio = require('cheerio')
let message = require('../message/message')
let cloudscraper = require('cloudscraper')
let db = require('../database/db')

MSOURCE = {
    mangapanda : {name:"mangapanda",url:"http://www.mangapanda.com/"},
    mangahere: {name:"mangahere",url:"http://www.mangahere.co/manga/"}
}

ACTION = {
    save : "save",
    delete : "delete"
}

function checkManga(senderId, manga, source, action) {
    // format url based on source
    let url
    switch(source.url) {
        case MSOURCE.mangapanda.url:
            url = source.url+manga.replace(/-/g, '').replace(/ /g, "-").replace(/:/g,'')
            break
        case MSOURCE.mangahere.url:
            url = source.url+manga.replace(/-/g, '').replace(/ /g, "_").replace(/:/g,'')
            break
        default:
            console.log("ERROR with sourcing url")
            message.sendTextMessage(senderId, `Error: Source Not Found`)
            return
    }

    console.log("Request: "+url)
    cloudscraper.get(url, function(error, response, html) {
        if(!error){
            switch(source.url) {
                case MSOURCE.mangapanda.url:
                    mangaPandaExtract(html, senderId, url, action)
                    break
                case MSOURCE.mangahere.url:
                    mangaHereExtract(html, senderId, url, action)
                    break
                default:
                    message.sendTextMessage(senderId, `Error: Source Not Found`)
                    break
            }
        } else {
            console.log("Error: Bad URL Request")
            console.log(error)
            message.sendTextMessage(senderId, `Error: Bad Manga Request`)
        }
    })
}

function checkAll(senderId) {
    db.checkAll({"id":senderId,"msource":MSOURCE,"callback":checkManga})
}

function sourceManga(senderId, mangaSource, obj) {
    console.log("Sourcing: "+mangaSource)
    switch(mangaSource) {
        case "options":
            message.sendTextMessage(senderId, `Sources Avaliable:\nmangapanda\nmangahere`)
            break
        case "mangapanda":
            obj.source = MSOURCE.mangapanda
            message.sendTextMessage(senderId, `Source switched to mangapanda`)
            break
        case "mangahere":
            obj.source = MSOURCE.mangahere
            message.sendTextMessage(senderId, `Source switched to mangahere`)
            break
        case "source":
            message.sendTextMessage(senderId, `Current Source: ${obj.source.name}`)
            break
        default:
            message.sendTextMessage(senderId, `Unfortunately I can't source "${mangaSource}" at the moment.`)
    }
}

function mangaPandaExtract(html, senderId, url, action) {
    let $ = cheerio.load(html)
    let error = $("h1").first().text()
    let mangaName
    console.log("ERROR")
    console.log(error)
    if (error == "404 Not Found") {
        console.log("Error: Bad Manga Request")
        message.sendTextMessage(senderId, "Can't see to find this manga. Did you spell it correctly?")
    } else {
        mangaName = $('.aname').first().text().trim().toLowerCase()
        console.log("CHECK")
        console.log(mangaName)
        let date = $("table#listing tr").last().children().next().text()
        let latestChapter = $("table#listing tr").last().find('a').attr('href')
        latestChapter = latestChapter.substring(latestChapter.lastIndexOf("/") + 1, latestChapter.length)

        if (action == ACTION.delete) {
            db.deleteManga({"id":senderId,"mangaName":mangaName,"source":MSOURCE.mangapanda.name})
            return
        }
        else if (action == ACTION.save) {
            db.addManga({"id":senderId,"mangaName":mangaName,"date":date,"latestChapter":latestChapter,"link":url, "source":MSOURCE.mangapanda.name})
        }
        else {
            let resMessage = `${mangaName}\nLast Updated: ${date}\n${url}/${latestChapter}`
            message.sendTextMessage(senderId, resMessage)
        }
    }
}

function mangaHereExtract(html, senderId, url, action) {
    let $ = cheerio.load(html)
    let error =$("div.error_text").length
    console.log("ERROR")
    console.log(error)
    if (error!=0) {
        console.log("Error: Bad Manga Request")
        message.sendTextMessage(senderId, "Can't see to find this manga. Did you spell it correctly?")
    } else {
        let mangaName
        mangaName = $('h1').first().text().trim().toLowerCase()
        console.log("CHECK")
        console.log(mangaName)
        let latest = $("div.detail_list ul").children().first()
        let date = latest.find('span.right').text()
        let latestChapter = latest.find('span.left a').text().trim().split(" ").slice(-1)[0]

        if (action == ACTION.delete) {
            db.deleteManga({"id":senderId,"mangaName":mangaName,"source":MSOURCE.mangahere.name})
            return
        }
        else if (action == ACTION.save) {
            db.addManga({"id":senderId,"mangaName":mangaName,"date":date,"latestChapter":latestChapter,"link":url, "source":MSOURCE.mangahere.name})
        }
        else {
            let resMessage = `${mangaName}\nLast Updated: ${date}\n${url}/c${latestChapter}`
            message.sendTextMessage(senderId, resMessage)
        }
    }
}

manga = new Object()
manga.checkManga = checkManga
manga.sourceManga = sourceManga
manga.source = MSOURCE.mangahere
manga.checkAll = checkAll

module.exports.manga = manga
module.exports.MSOURCE = MSOURCE