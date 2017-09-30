<img src="https://github.com/dtan44/MangaUp/blob/master/mangauplogo.png" alt="MangaUp"/>

# MangaUp

MangaUp is a facebook messenger bot designed to check for manga updates from various online sources. All logos and pictures are designed and taken by [dtan44](https://github.com/dtan44).

## Getting Started

The chat bot can be accessed at [MangaUp's page](https://www.facebook.com/MangaUpPage). Send a message to MangaUp's page to get started.

### Chat Commands

Here are the current commands avaliable to MangaUp:

    - help: returns list of possible commands
    - source: returns current manga source
    - source options: returns list of possible sources
    - source (source): changes manga source to (source)
    - check (manga): checks (manga) for latest chapter
    - save (manga): saves (manga) to favorite list
    - delete (manga): deletes (manga) from favorite list
    - list: returns list of saved manga from favorite list
    - check all: returns latest chapters from all mangas in favorite list

## Technologies Used

This project is implemented in node.js and hosted in Heroku. [Express.js](https://github.com/expressjs/express) was used to create the API endpoints, while [Cloudscraper.js](https://github.com/codemanki/cloudscraper) and [Cheerio.js](https://github.com/cheeriojs/cheerio) are used to get and parse manga website htmls respectively. Heroku's postgres database is also used to store user's favorite manga list. 

## Future

Since MangaUp is a personal project and is currently utilizing Heroku's hobby-dev plans, future feature development might not be immediate. However, there are many next steps for this project:

    - Creating unit tests
    - Adding more manga sources
    - Sending periodic manga updates from saved list
    - Improving button/graphic interface

## Authors

* **Dylan Tan** - *Main Programmer* - [dtan44](https://github.com/dtan44)

## License

This project is licensed under the MIT License - see the [LICENSE.txt](https://github.com/dtan44/MangaUp/blob/master/license.txt) file for details

## Acknowledgments

* My friends who tested the chat bot
* Anyone who contributed to the amazing node packages
