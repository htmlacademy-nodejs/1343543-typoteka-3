'use strict';
const {WrapperClass} = require(`../../constants`);

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();
const auth = require(`../middlewares/auth`);

myRouter.get(`/`, auth, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my/my`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    articles
  });
});
myRouter.get(`/comments`, auth, async (req, res) => {
  const articles = await api.getArticles({comments: true});

  const comments = {
    title: articles[0].title,
    comments: articles[0].comments
  };
  res.render(`my/comments`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    comments
  });
});

myRouter.get(`/categories`, auth, async (req, res) => {
  const categories = await api.getCategories({withCount: false});
  res.render(`my/categories`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    categories,
  });
});

module.exports = myRouter;
