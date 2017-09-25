let message = require('../message/message')
let db = require('../database/db')

// entry requirements: 
//      senderId
//      action
//      source
function mangaPandaExtract($, entry) {
    let error = $("h1").first().text()
    let mangaName
    console.log("ERROR")
    console.log(error)
    if (error == "404 Not Found") {
        console.log("Error: Bad Manga Request")
        message.sendTextMessage(entry.senderId, "Can't see to find this manga. Did you spell it correctly?")
    } else {
        mangaName = $('.aname').first().text().trim().toLowerCase()
        console.log("CHECK")
        console.log(mangaName)
        let date = $("table#listing tr").last().children().next().text()
        let latestChapter = $("table#listing tr").last().find('a').attr('href')
        latestChapter = latestChapter.substring(latestChapter.lastIndexOf("/") + 1, latestChapter.length)

        switch(entry.action) {
            case ACTION.delete:
                db.deleteManga({"id":entry.senderId,"mangaName":mangaName,"source":MSOURCE.mangapanda.name})
                break
            case ACTION.save:
                db.addManga({"id":entry.senderId,"mangaName":mangaName,"date":date,"latestChapter":latestChapter,"link":entry.url, "source":MSOURCE.mangapanda.name})
                break
            default:
                let resMessage = `${mangaName}\nLast Updated: ${date}\n${entry.url}/${latestChapter}`
                message.sendTextMessage(entry.senderId, resMessage)
        }
    }
}

module.exports.mangaPandaExtract = mangaPandaExtract