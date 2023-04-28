const http = require('http');
const fs = require('fs');

// const express = require('express');

// const app = express();
// app.use(express.static('public'));

const dataBooks = fs.readFileSync(
  `${__dirname}/dev-data/books-data.json`,
  'utf8'
);
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf8'
);

const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf8'
);

const templateBook = fs.readFileSync(
  `${__dirname}/templates/template-book.html`,
  'utf8'
);

const books = JSON.parse(dataBooks).map((book, i) => {
  return {
    ...book,
    id: i,
  };
});

const replacePlaceholders = function (template, book) {
  let output = template.replaceAll('{%PLACEHOLDER-COVER%}', book.coverImage);
  output = output.replaceAll(`{%PLACEHOLDER-TITLE%}`, book.title);
  output = output.replaceAll(`{%PLACEHOLDER-AUTHOR%}`, book.author);
  output = output.replaceAll(`{%PLACEHOLDER-GENRE%}`, book.genre);
  output = output.replaceAll(`{%PLACEHOLDER-PRICE%}`, book.price);
  output = output.replaceAll(`{%PLACEHOLDER-ID%}`, book.id);

  if (!book.bestSeller) {
    output = output.replaceAll(
      `{%PLACEHOLDER-NOT-BEST-SELLER%}`,
      'not-best-seller'
    );
  }

  return output;
};

const server = http.createServer((req, res) => {
  if (req.url === '/api') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(dataBooks);
  } else if (req.url === '/' || req.url === '/overview') {
    const cardsMarkup = books
      .map(book => replacePlaceholders(templateCard, book))
      .join('');
    const output = templateOverview.replace(
      '{%PLACEHOLDER-CARDS%}',
      cardsMarkup
    );
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(output);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>404 page not found</h1>');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
