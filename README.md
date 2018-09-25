# Horseman Article Parser UI

A web page article parser which returns the article's formatted text & other attributes including Google SERP preview, sentiment, keyphrases, people, places, organisations and spelling suggestions.

![Preview](https://i.imgur.com/daCGQSu.png "App Preview")

### Prerequisites

Node.js & [Yarn](https://yarnpkg.com/en/)

### Install

Clone the repo

```
git clone https://github.com/fmacpro/horseman-article-parser-ui.git
```

Next make sure you have [Yarn](https://yarnpkg.com/en/) installed and run the following command in the repo root. This will install the required dependencies

```
yarn
```

### Running the Article Parser App

you can run the app by simply doing the following command from the repo root

```
node index.js
```

then browse to `http://localhost:3000/`

for debugging the phantom.js process you can start the app with

```
DEBUG=horseman node index.js
```


## Development

Please feel free to fork the repo or open pull requests to the development branch. I've used [eslint](https://eslint.org/) for linting & [yarn](https://yarnpkg.com/en/) for dependency management. 

Build the dependencies with:
```
yarn
```

Lint the index.js & app.js files with:
```
yarn lint
```

The parser is also available as an [NPM module](https://github.com/fmacpro/horseman-article-parser) for use in your own projects.

## Dependencies

- [ejs](https://ghub.io/ejs): Embedded JavaScript templates
- [express](https://ghub.io/express): Fast, unopinionated, minimalist web framework
- [horseman-article-parser](https://ghub.io/horseman-article-parser): Web Page Inspection Tool. Sentiment Analysis, Keyword Extraction, Named Entity Recognition &amp; Spell Check
- [socket.io](https://ghub.io/socket.io): node.js realtime framework server

## Dev Dependencies

- [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-standard](https://ghub.io/eslint-config-standard): JavaScript Standard Style - ESLint Shareable Config
- [eslint-plugin-import](https://ghub.io/eslint-plugin-import): Import with sanity.
- [eslint-plugin-node](https://ghub.io/eslint-plugin-node): Additional ESLint&#39;s rules for Node.js
- [eslint-plugin-promise](https://ghub.io/eslint-plugin-promise): Enforce best practices for JavaScript promises
- [eslint-plugin-standard](https://ghub.io/eslint-plugin-standard): ESlint Plugin for the Standard Linter

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE Version 3 - see the [LICENSE.md](LICENSE.md) file for details
