var app = angular.module('app', [
  'btford.socket-io',
  'ui.bootstrap',
  'ngSanitize'
])

app.factory('socket', function (socketFactory) {
  return socketFactory()
})

app.controller('mainController', function (socket, $scope, $window) {
  $scope.search = {}
  $scope.proccessing = false
  $scope.status = ''

  $scope.getResults = function () {
    $scope.status = ''
    $scope.error = null
    $scope.article = null
    socket.emit('parse:article', $scope.search)
    $scope.proccessing = true
  }

  socket.on('parse:article', function (article) {
    var jsonData = {
      title: article.title,
      metadescription: article.metadescription,
      url: article.url,
      sentiment: { score: article.sentiment.score, comparative: article.sentiment.comparative },
      keyphrases: article.keyphrases,
      people: article.people,
      orgs: article.orgs,
      places: article.places
    }

    $scope.jsonData = JSON.stringify(jsonData, null, 2)

    if (typeof article.metadescription === 'undefined') article.metadescription = ''
    if (typeof article.title === 'undefined') article.title = ''

    if (article.metadescription.length > 158) article.metadescription = article.metadescription.substring(0, 158) + '...'
    if (article.title.length > 71) article.title = article.title.substring(0, 71) + '...'
    if (article.url.length > 71) article.url = article.url.substring(0, 71) + '...'

    $scope.article = article
    $scope.proccessing = false
    $scope.status = ''
  })

  socket.on('parse:error', function () {
    $scope.proccessing = false
  })

  socket.on('parse:status', function (status) {
    console.log(status)
    $scope.status += status + ' \n'
  })
})
