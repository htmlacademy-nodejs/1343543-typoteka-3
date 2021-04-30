'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/`, (req, res) => res.send(`/`));
offersRouter.get(`/register`, (req, res) => res.send(`/register`));
offersRouter.get(`/login`, (req, res) => res.send(`/login`));
offersRouter.get(`/search`, (req, res) => res.send(`/search`));
offersRouter.get(`/categories`, (req, res) => res.send(`/categories`));

module.exports = offersRouter;
