const express = require('express')
const http = require('http')
const socketio = require('socket.io')

async function main () {
  const next = (await import('next')).default
  const parser = await import('horseman-article-parser')

  const dev = process.env.NODE_ENV !== 'production'
  const nextApp = next({ dev, dir: './public' })
  const handle = nextApp.getRequestHandler()

  await nextApp.prepare()

  const app = express()
  const server = http.createServer(app)
  const io = socketio(server)

  const options = {
    puppeteer: {
      launch: {
        headless: true,
        defaultViewport: { width: 768, height: 2048, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      }
    },
    enabled: ['screenshot', 'sentiment', 'entities', 'spelling', 'keywords']
  }

  io.on('connection', function (socket) {
    socket.on('parse:article', function (msg) {
      options.url = msg.url

      if (msg.tor === true) {
        options.puppeteer.args = ['--proxy-server=socks5://127.0.0.1:9050']
      }

      parser.parseArticle(options, socket)
        .then(function (article) {
          const response = {
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
            screenshot: article.screenshot,
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

  app.all('*', (req, res) => handle(req, res))

  server.listen(3000, function () {
    console.log('listening on *:3000')
  })
}

main()
