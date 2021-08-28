'use strict';
const {WrapperClass} = require(`../../constants`);

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my/my`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    articles
  });
});
myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();

  const comments = {
    title: articles[0].title,
    comments: articles[0].comments
  };
  res.render(`my/comments`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    comments
  });
});
myRouter.get(`/new-post`, (req, res) => res.render(`my/new-post`));
myRouter.get(`/categories`, (req, res) => res.render(`my/categories`, {wrapper: WrapperClass.NO_BACKGROUND}));

module.exports = myRouter;
