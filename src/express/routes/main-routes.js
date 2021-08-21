'use strict';
const {WrapperClass} = require(`../../constants`);

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main/main`, {articles});
});

mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/search`, async (req, res) => {
  try {
    const query = req.query.search;
    const results = await api.search(query);
    res.render(`main/search`, {
      wrapper: WrapperClass.COLOR,
      results
    });
  } catch (error) {
    res.render(`main/search`, {
      wrapper: WrapperClass.COLOR,
      results: []
    });
  }
});
mainRouter.get(`/404`, (req, res) => res.render(`errors/404`, {wrapper: WrapperClass.COLOR}));
mainRouter.get(`/500`, (req, res) => res.render(`errors/500`, {wrapper: WrapperClass.COLOR}));

module.exports = mainRouter;
