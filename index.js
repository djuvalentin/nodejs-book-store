const http = require('http');
const fs = require('fs');
const url = require('url');

const slugify = require('slugify');

const replacePlaceholders = require('./modules/replacePlaceholders');

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
    slug: slugify(book.title, { lower: true }),
  };
});

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/api') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(dataBooks);
  } else if (pathname === '/' || pathname === '/overview') {
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
  } else if (pathname === '/book') {
    const book = books.find(book => book.slug === query.title);

    if (!book) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end('<h1>404 page not found</h1>');
    } else {
      const bookMarkup = replacePlaceholders(templateBook, book);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(bookMarkup);
    }
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>404 page not found</h1>');
  }
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
