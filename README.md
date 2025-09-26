# Horseman Article Parser UI

A web page article parser which returns the article's formatted text & other attributes including a summary, readability metrics, sentiment, keyphrases, people, places, organisations and spelling suggestions. The UI is built with Next.js and React.

![Preview](https://i.imgur.com/gJLtMYu.png "App Preview")

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

Run the app by using the following command from the repo root

```
npm start
```

then browse to `http://localhost:3000/`

## Development

Please feel free to fork the repo or open pull requests. The UI uses [Next.js](https://nextjs.org/) with [React](https://react.dev/). I've used [eslint](https://eslint.org/) for linting and npm for dependency management.

Build the dependencies with:

```
npm install
```

Lint the project files with:

```
npm run lint
```

The parser is also available as an [NPM module](https://github.com/fmacpro/horseman-article-parser) for use in your own projects.

## Server Dependencies

- [express](https://ghub.io/express): Fast, unopinionated, minimalist web framework
- [horseman-article-parser](https://ghub.io/horseman-article-parser): Web Page Inspection Tool. Sentiment Analysis, Keyword Extraction, Named Entity Recognition &amp; Spell Check
- [socket.io](https://ghub.io/socket.io): node.js realtime framework server

## Frontend Dependencies

- [next](https://ghub.io/next): React framework for server-side rendering
- [react](https://ghub.io/react): Library for building user interfaces
- [react-dom](https://ghub.io/react-dom): React package for working with the DOM
- [socket.io-client](https://ghub.io/socket.io-client): Realtime application framework client

## Dev Dependencies

- [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [eslint-plugin-json](https://ghub.io/eslint-plugin-json): Lint JSON files
- [eslint-plugin-n](https://ghub.io/eslint-plugin-n): Additional ESLint&#39;s rules for Node.js
- [eslint-plugin-promise](https://ghub.io/eslint-plugin-promise): Enforce best practices for JavaScript promises

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE Version 3 - see the [LICENCE](LICENCE) file for details
