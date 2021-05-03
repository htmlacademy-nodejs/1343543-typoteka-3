'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));
articlesRouter.get(`/add`, (req, res) => res.send(`/articles/add`));
articlesRouter.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/${req.params.id}`));
articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));

module.exports = articlesRouter;
