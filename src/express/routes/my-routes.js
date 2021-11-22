'use strict';
const {WrapperClass} = require(`../../constants`);

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();
const auth = require(`../middlewares/auth`);
const upload = require(`../middlewares/upload`);

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

myRouter.post(`/categories`, auth, async (req, res) => {
  const category = req.body[`add-category`];
  try {
    await api.createCategory(category);
    res.redirect(`/my/categories`);
  } catch (errors) {
    console.log(errors);
    // const validationMessages = prepareErrors(errors);
    // const categories = await getAddArticleData();
    // res.render(`articles/post-add`, {categories, validationMessages});
  }
});

module.exports = myRouter;
