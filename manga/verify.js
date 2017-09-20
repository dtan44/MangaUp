let request = require('request')
let cheerio = require('cheerio')
let message = require('../message/message')
let cloudscraper = require('cloudscraper')

function verifyManga(senderID, manga) {
    // let url = "http://www.mangapanda.com/"+manga.replace(/-/g, '').replace(/ /g, "-").replace(/:/g,'')
    // console.log(url)
    // cloudscraper.get(url, function(error, response, html){
    //     // First we'll check to make sure no errors occurred when making the request
    //     if(!error){
    //         let $ = cheerio.load(html)
    //         let title = $("h1").first().text()
    //         let mangaName
    //         console.log("TITLE")
    //         console.log(title)
    //         if (title == "404 Not Found") {
    //             console.log("Error: Bad Manga Request")
    //             message.sendTextMessage(senderID, `Error: Bad Manga Request`)
    //         } else {
    //             mangaName = $('.aname').first().text().trim()
    //             console.log("CHECK")
    //             console.log($('#title'))
    //             console.log(`Verified  Successfully`)
    //             let date = $("table#listing tr").last().children().next().text()
    //             let latestChapter = $("table#listing tr").last().find('a').attr('href')
    //             message.sendTextMessage(senderID,`${mangaName}\nLast Updated: ${date}\nhttp://www.mangapanda.com${latestChapter}`)
    //             console.log(`DATE: ${date}`)
    //         }
    //     } else {
    //         console.log("Error: Bad URL Request")
    //         console.log(error)
    //         message.sendTextMessage(senderID, `500 Server Error`)
    //     }
    // })
    let res = mangaSourceExtract(manga, MSOURCE.mangapanda)
    if (!res) {
        message.sendTextMessage(senderID, `Error: Bad Manga Request`)
    }
    else {
        resMessage = `${res.mangaName}\nLast Updated: ${res.dateLastUpdated}\n${MSOURCE.mangapanda}${res.latestChapter}`
        message.sendTextMessage(senderID, resMessage)
    }
}

function mangaSourceExtract(manga, source) {
    let url = source+manga.replace(/-/g, '').replace(/ /g, "-").replace(/:/g,'')
    let htmlRes
    let res

    cloudscraper.get(url, function(error, response, html){
        if(!error){
            htmlRes = cheerio.load(html)
        } else {
            console.log("Error: Bad URL Request")
            console.log(error)
            res = null
        }
    })

    switch(source) {
        case MSOURCE.mangapanda:
            res = mangaPandaExtract(htmlRes)
        case MSOURCE.kissmanga:
            res = kissMangaExtract(htmlRes)
        default:
            res = null
    }

    return res
}

function mangaPandaExtract(html) {
    let title = $("h1").first().text()
    let mangaName
    console.log("TITLE")
    console.log(title)
    if (title == "404 Not Found") {
        console.log("Error: Bad Manga Request")
        return null
    } else {
        mangaName = $('.aname').first().text().trim()
        console.log("CHECK")
        console.log($('#title'))
        console.log(`Verified  Successfully`)
        let date = $("table#listing tr").last().children().next().text()
        let latestChapter = $("table#listing tr").last().find('a').attr('href')
        res = {}
        res.mangaName = mangaName
        res.dateLastUpdated = date
        res.latestChapter = latestChapter
        return res
    }
}

function kissMangaExtract(html) {
    return null
}


MSOURCE = {
    mangapanda : "http://www.mangapanda.com/",
    kissmanga: "http://kissmanga.com/manga/"
}

module.exports.verifyManga = verifyManga
