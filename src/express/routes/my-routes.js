'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/`, (req, res) => res.render(`my/my`, {wrapper: `wrapper wrapper--nobackground`}));
offersRouter.get(`/comments`, (req, res) => res.render(`my/comments`, {wrapper: `wrapper wrapper--nobackground`}));
offersRouter.get(`/new-post`, (req, res) => res.render(`my/new-post`));
offersRouter.get(`/categories`, (req, res) => res.render(`my/categories`));

module.exports = offersRouter;
