module.exports = (template, book) => {
  let output = template.replaceAll('{%PLACEHOLDER-COVER%}', book.coverImage);
  output = output.replaceAll(`{%PLACEHOLDER-TITLE%}`, book.title);
  output = output.replaceAll(`{%PLACEHOLDER-AUTHOR%}`, book.author);
  output = output.replaceAll(`{%PLACEHOLDER-GENRE%}`, book.genre);
  output = output.replaceAll(`{%PLACEHOLDER-PRICE%}`, book.price);
  output = output.replaceAll(`{%PLACEHOLDER-ID%}`, book.id);
  output = output.replaceAll(`{%PLACEHOLDER-SLUG%}`, book.slug);
  output = output.replaceAll(`{%PLACEHOLDER-SUMMARY%}`, book.summary);

  if (!book.bestSeller) {
    output = output.replaceAll(
      `{%PLACEHOLDER-NOT-BEST-SELLER%}`,
      'not-best-seller'
    );
  }

  return output;
};
