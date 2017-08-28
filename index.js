// MangaUp index

const express = require('express')
const app = express()

app.set('port', (process.env.PORT || 5000))

app.get('/', function(request, response) {
    response.send('Hello World')
})

app.listen(app.get('port'), function(err) {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log('Node app is running on port', app.get('port'))
})