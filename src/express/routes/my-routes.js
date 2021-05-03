'use strict';
const {WrapperClass} = require(`../../constants`);

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/`, (req, res) => res.render(`my/my`, {wrapper: WrapperClass.NO_BACKGROUND}));
offersRouter.get(`/comments`, (req, res) => res.render(`my/comments`, {wrapper: WrapperClass.NO_BACKGROUND}));
offersRouter.get(`/new-post`, (req, res) => res.render(`my/new-post`));
offersRouter.get(`/categories`, (req, res) => res.render(`my/categories`, {wrapper: WrapperClass.NO_BACKGROUND}));

module.exports = offersRouter;
