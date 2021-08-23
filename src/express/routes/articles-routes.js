'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

const api = require(`../api`).getAPI();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`articles/post-edit`, {
    article,
    categories
  });
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/post-add`, {categories});
});

articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));

articlesRouter.post(`/add`, async (req, res) => {
  console.log(req.body);
  try {
    await api.createArticle();
    res.redirect(`../my`);
  } catch (e) {
    res.redirect(`back`);
  }
});

module.exports = articlesRouter;
