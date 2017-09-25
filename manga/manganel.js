let message = require('../message/message')
let db = require('../database/db')
let getUrl = require('./helper').getUrl

// entry requirements: 
//      senderId
//      action
function mangaNelSearch($, entry) {
    let error = $("div.daily-update-item").length
    let mangaName
    console.log("ERROR")
    console.log(error)

    // check how many search results
    if (error == 0) {
        console.log("Error: Bad Manga Request")
        message.sendTextMessage(entry.senderId, "Can't see to find this manga. Did you spell it correctly?")
    } 
    else if (error > 1){
        let res = []
        let extract = (i,val)=>{
                        res.push( {name : $(val).find("span a").text(),
                                url : $(val).find("span a").attr('href')} )}

        $("div.daily-update-item").each(extract)

        console.log("RES:"+JSON.stringify(res))

        message.sendQuickResponseMangaNel(entry.senderId, entry.action, res)

    } else {
        let url = $("div.daily-update-item").children().first().find("span a").attr('href')
        let newEntry = {
            senderId: entry.senderId,
            url: url,
            action: entry.action
        }
        console.log("NEWENTRY2 "+JSON.stringify(newEntry))
        let callback = mangaNelExtract

        getUrl(url, newEntry, callback)
    }
}

// entry requirements: 
//      senderId
//      action
//      url
function mangaNelExtract($, entry) {
    let mangaName = $('ul.manga-info-text li').first().find("h1").text().trim().toLowerCase()
    console.log("CHECK")
    console.log(mangaName)
    let row = $("div.chapter-list div.row").first().find("span")
    let date = row.last().text().trim()
    let latestChapter = row.first().first().text().trim().split(" ")[1]
    let latestlink = row.first().find("a").attr("href")

    switch (entry.action) {
        case ACTION.delete:
            db.deleteManga({"id":entry.senderId,"mangaName":mangaName,"source":MSOURCE.manganel.name})
            break
        case ACTION.save:
            db.addManga({"id":entry.senderId,"mangaName":mangaName,"date":date,"latestChapter":latestChapter,"link":entry.url, "source":MSOURCE.manganel.name})
            break
        default:
            let resMessage = `${mangaName}\nLast Updated: ${date}\n${latestlink}`
            message.sendTextMessage(entry.senderId, resMessage)
    }
}

module.exports.mangaNelSearch = mangaNelSearch
module.exports.mangaNelExtract = mangaNelExtract