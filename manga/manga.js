let message = require('../message/message')
let db = require('../database/db')
let manganel = require('./manganel')
let mangapanda = require('./mangapanda')
let getUrl = require('./helper').getUrl

MSOURCE = {
    mangapanda : {name:"mangapanda",url:"http://www.mangapanda.com/"},
    manganel: {name:"manganel",url:"http://manganel.com/",search:"http://manganel.com/search/"}
}

ACTION = {
    save : "save",
    delete : "delete"
}

function checkManga(entry) {
    // set url based on source
    let url
    if (entry.url) {
        url = entry.url
    }
    else {
        switch(entry.source) {
            case MSOURCE.mangapanda:
                url = entry.source.url+entry.manga.replace(/-/g, '').replace(/ /g, "-").replace(/:/g,'')
                break
            case MSOURCE.manganel:
                url = entry.source.search+entry.manga.replace(/ /g, "_").replace(/:/g,'')
                break
            default:
                console.log("ERROR with sourcing url")
                message.sendTextMessage(entry.senderId, `Error: Source Not Found`)
                return
        }
    }

    console.log("Request: "+url)
    console.log("SOURCE:"+entry.source)
    console.log("ID:"+entry.senderId)

    // set callback based on source and url
    let callback
    switch(entry.source) {
        case MSOURCE.mangapanda:
            callback = mangapanda.mangaPandaExtract
            entry.url = url
            break
        case MSOURCE.manganel:
            if (entry.url) {
                callback = manganel.mangaNelExtract
            }
            else {
                callback = manganel.mangaNelSearch
            }
            break
        default:
            message.sendTextMessage(entry.senderId, `Error: Source Not Found`)
            return
    }
    console.log(callback)

    getUrl(url, entry, callback)
}

function checkAll(senderId) {
    let callback = (err,res) =>
    {
        if (err) {
            console.log("ERROR WITH DB: "+err)
            message.sendTextMessage(senderId, `I'm having problems listing your manga. Try again later? :'(`)
        }
        else {
            for (var i = 0; i < res.rows.length; i++) {
              let item = res.rows[i]
              let newEntry = {
                senderId: senderId,
                url: item.link,
                source: MSOURCE[item.source]
              }
              console.log(item.source)
              console.log("NEWENTRY:"+JSON.stringify(newEntry))
              checkManga(newEntry)    
            }
        }
    }
    db.checkAll({"id":senderId,"callback":callback})
}

function sourceManga(senderId, mangaSource, obj) {
    console.log("Sourcing: "+mangaSource)
    switch(mangaSource) {
        case "options":
            message.sendTextMessage(senderId, `Sources Avaliable:\nmangapanda\nmanganel`)
            break
        case "mangapanda":
            obj.source = MSOURCE.mangapanda
            message.sendTextMessage(senderId, `Source switched to mangapanda`)
            break
        case "manganel":
            obj.source = MSOURCE.manganel
            message.sendTextMessage(senderId, `Source switched to manganel`)
            break
        case "source":
            message.sendTextMessage(senderId, `Current Source: ${obj.source.name}`)
            break
        default:
            message.sendTextMessage(senderId, `Unfortunately I can't source "${mangaSource}" at the moment.`)
    }
}

// function mangaHereExtract(html, senderId, url, action) {
//     let $ = cheerio.load(html)
//     let error =$("div.error_text").length
//     console.log("ERROR")
//     console.log(error)
//     if (error!=0) {
//         console.log("Error: Bad Manga Request")
//         message.sendTextMessage(senderId, "Can't see to find this manga. Did you spell it correctly?")
//     } else {
//         let mangaName
//         mangaName = $('h1').first().text().trim().toLowerCase()
//         console.log("CHECK")
//         console.log(mangaName)
//         let latest = $("div.detail_list ul").children().first()
//         let date = latest.find('span.right').text()
//         let latestChapter = latest.find('span.left a').text().trim().split(" ").slice(-1)[0]
//         let latestUrl = latest.find('span.left a').attr('href')

//         if (action == ACTION.delete) {
//             db.deleteManga({"id":senderId,"mangaName":mangaName,"source":MSOURCE.mangahere.name})
//             return
//         }
//         else if (action == ACTION.save) {
//             db.addManga({"id":senderId,"mangaName":mangaName,"date":date,"latestChapter":latestChapter,"link":url, "source":MSOURCE.mangahere.name})
//         }
//         else {
//             let resMessage = `${mangaName}\nLast Updated: ${date}\n${latestUrl}`
//             message.sendTextMessage(senderId, resMessage)
//         }
//     }
// }


manga = new Object()
manga.checkManga = checkManga
manga.sourceManga = sourceManga
manga.source = MSOURCE.mangapanda
manga.checkAll = checkAll
manga.getUrl = getUrl

module.exports.manga = manga
module.exports.MSOURCE = MSOURCE