# Horseman Article Parser UI

A web page article parser which returns the article's formatted text & other attributes including Google SERP preview, sentiment, keyphrases, people, places, organisations and spelling suggestions.

![Preview](https://i.imgur.com/daCGQSu.png "App Preview")

[online preview](https://inspector.fmac.pro/)

### Prerequisites

Node.js & NPM

### Install

Clone the repo

```
git clone https://github.com/fmacpro/horseman-article-parser-ui.git
```

Next run the following command in the repo root. This will install the required dependencies

```
npm install
```

### Running the Article Parser App

you can run the app by simply doing the following command from the repo root

```
node index.js
```

then browse to `http://localhost:3000/`


## Development

Please feel free to fork the repo or open pull requests to the development branch. I've used [eslint](https://eslint.org/) for linting & [yarn](https://yarnpkg.com/en/) for dependency management. 

Build the dependencies with:
```
npm install
```

Lint the index.js & app.js files with:
```
npm run lint
```

The parser is also available as an [NPM module](https://github.com/fmacpro/horseman-article-parser) for use in your own projects.

## Server Dependencies

- [ejs](https://ghub.io/ejs): Embedded JavaScript templates
- [express](https://ghub.io/express): Fast, unopinionated, minimalist web framework
- [horseman-article-parser](https://ghub.io/horseman-article-parser): Web Page Inspection Tool. Sentiment Analysis, Keyword Extraction, Named Entity Recognition &amp; Spell Check
- [socket.io](https://ghub.io/socket.io): node.js realtime framework server

## Frontend Dependencies

- [@fortawesome/fontawesome-free](https://ghub.io/@fortawesome/fontawesome-free): The iconic font, CSS, and SVG framework
- [angular](https://ghub.io/angular): HTML enhanced for web apps
- [angular-sanitize](https://ghub.io/angular-sanitize): AngularJS module for sanitizing HTML
- [angular-socket-io](https://ghub.io/angular-socket-io): Bower Component for using AngularJS with [Socket.IO](http://socket.io/), based on [this](http://briantford.com/blog/angular-socket-io.html).
- [angular-ui-bootstrap](https://ghub.io/angular-ui-bootstrap): Native AngularJS (Angular) directives for Bootstrap
- [bootstrap](https://ghub.io/bootstrap): The most popular front-end framework for developing responsive, mobile first projects on the web.
- [install](https://ghub.io/install): Minimal JavaScript module loader
- [jquery](https://ghub.io/jquery): JavaScript library for DOM operations
- [npm](https://ghub.io/npm): a package manager for JavaScript


## Dev Dependencies

- [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-standard](https://ghub.io/eslint-config-standard): JavaScript Standard Style - ESLint Shareable Config
- [eslint-plugin-import](https://ghub.io/eslint-plugin-import): Import with sanity.
- [eslint-plugin-json](https://ghub.io/eslint-plugin-json): Lint JSON files
- [eslint-plugin-node](https://ghub.io/eslint-plugin-node): Additional ESLint&#39;s rules for Node.js
- [eslint-plugin-promise](https://ghub.io/eslint-plugin-promise): Enforce best practices for JavaScript promises
- [eslint-plugin-standard](https://ghub.io/eslint-plugin-standard): ESlint Plugin for the Standard Linter


## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE Version 3 - see the [LICENSE.md](LICENSE.md) file for details
