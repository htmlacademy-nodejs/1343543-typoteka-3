'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/`, (req, res) => res.render(`main/main`));
offersRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));
offersRouter.get(`/login`, (req, res) => res.render(`main/login`));
offersRouter.get(`/search`, (req, res) => res.render(`main/search`));
offersRouter.get(`/categories`, (req, res) => res.send(`/categories`));
offersRouter.get(`/404`, (req, res) => res.render(`errors/404`));
offersRouter.get(`/500`, (req, res) => res.render(`errors/500`));

module.exports = offersRouter;
