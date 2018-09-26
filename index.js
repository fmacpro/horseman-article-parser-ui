var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var parser = require('horseman-article-parser')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.render('index')
})

var options = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
  horseman: {
    timeout: 10000,
    cookies: './cookies.json'
  }
}

io.on('connection', function (socket) {
  socket.on('parse:article', function (msg) {
    options.url = msg.url

    if (msg.tor === true) {
      options.horseman.proxy = '127.0.0.1:9050'
      options.horseman.proxyType = 'socks5'
    } else {
      options.horseman.proxyType = 'none'
    }

    parser.parseArticle(options, socket)
      .then(function (article) {
        var response = {
          title: article.title.text,
          metadescription: article.meta.description.text,
          url: article.url,
          sentiment: article.sentiment,
          keyphrases: article.processed.keyphrases,
          people: article.people,
          orgs: article.orgs,
          places: article.places,
          text: {
            raw: article.processed.text.raw,
            formatted: article.processed.text.formatted,
            html: article.processed.text.html
          },
          html: article.processed.html,
          image: article.meta['og:image'],
          screenshot: article.mobile,
          spelling: article.spelling
        }

        socket.emit('parse:article', response)
      })
      .catch(function (error) {
        socket.emit('parse:status', error.message)
        socket.emit('parse:error', {})
        socket.emit('parse:status', '\n' + error.stack)
      })
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
