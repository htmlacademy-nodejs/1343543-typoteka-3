'use strict';

const CategoryService = require(`./category`);
const SearchService = require(`./search`);
const OfferService = require(`./article`);
const CommentService = require(`./comment`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  OfferService,
};
