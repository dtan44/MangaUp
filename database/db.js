let message = require('../message/message')

const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

client.connect()

function addManga(entry) {
    let query = `SELECT * FROM manga WHERE id = '${entry.id}';`
    console.log("QUERY:"+query)
    client.query(query, (err, res) => {
      if (err) {
        console.log("ERROR WITH DB: "+err)
        message.sendTextMessage(entry.id, `I'm having problems saving your manga. Try again later? :'(`)
      }
      else {
        if (res.rows.length >= 10) {
            message.sendTextMessage(entry.id, "Apologies, but due to my current limited capacity, I can only save up to 10 mangas. Delete your other mangas before trying again (or donate money 😍)")
        }
        else {
            query = `INSERT INTO manga (id,manganame,date,link,source,latestchapter, timestamp) VALUES ('${entry.id}','${entry.mangaName}','${entry.date}','${entry.link}','${entry.source}','${entry.latestChapter}', '${new Date().toISOString()}') ON CONFLICT (id, manganame, source) DO UPDATE SET date = EXCLUDED.date, latestchapter = EXCLUDED.latestchapter, timestamp = EXCLUDED.timestamp;`
            console.log("QUERY:"+query)
            client.query(query, (err, res) => {
              if (err) {
                console.log("ERROR WITH DB: "+err)
                message.sendTextMessage(entry.id, `I'm having problems saving this manga. Blame my programmer, not me :p`)
              }
              else {
                message.sendTextMessage(entry.id, `"${entry.mangaName}" saved`)
              }
            })
        }
      }
    })
}

function checkAll(entry) {
    let query = `SELECT * FROM manga WHERE id = '${entry.id}';`
    console.log("QUERY:"+query)
    client.query(query, (err, res) => {
      if (err) {
        console.log("ERROR WITH DB: "+err)
        message.sendTextMessage(entry.id, `I'm having problems listing your manga. Try again later? :'(`)
      }
      else {
        for (var i = 0; i < res.rows.length; i++) {
          item = res.rows[i]
          entry.callback(entry.id,item.manganame,entry.msource[item.source])
        }
      }
  })
}

function deleteManga(entry) {
    let query = `DELETE FROM manga WHERE id = '${entry.id}' AND manganame = '${entry.mangaName}' AND source='${entry.source}';`
    console.log("QUERY:"+query)
    client.query(query, (err, res) => {
      if (err) {
        console.log("ERROR WITH DB: "+err)
        message.sendTextMessage(entry.id, `I'm having problems deleting this manga. I'm sorry :/`)
      }
      else {
        message.sendTextMessage(entry.id, `"${entry.mangaName}" deleted`)
      }
    })
}

function listAll(entry) {
    let query = `SELECT * FROM manga WHERE id = '${entry.id}';`
    console.log("QUERY:"+query)
    client.query(query, (err, res) => {
      if (err) {
        console.log("ERROR WITH DB: "+err)
        message.sendTextMessage(entry.id, `I'm having problems listing your manga. Try again later? :'(`)
      }
      else {
        message.sendTextMessage(entry.id, res.rows.reduce((total,value)=>{return total+'\n'+value.manganame+' ('+value.source+')'},'Your Saved List:'))
      }
    })
}


module.exports.addManga = addManga
module.exports.deleteManga = deleteManga
module.exports.listAll = listAll
module.exports.checkAll = checkAll