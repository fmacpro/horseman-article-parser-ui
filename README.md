# Horseman Article Parser UI

A web page article parser which returns the article's formatted text & other attributes including Google SERP preview, sentiment, keyphrases, people, places, organisations and spelling suggestions. 

### Prerequisites

Node.js & [Yarn](https://yarnpkg.com/en/)

### Install

Clone the repo

```
git clone https://github.com/fmacpro/horseman-article-parser.git
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

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE Version 3 - see the [LICENSE.md](LICENSE.md) file for details