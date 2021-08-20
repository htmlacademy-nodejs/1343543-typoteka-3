'use strict';
const {WrapperClass} = require(`../../constants`);

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`my/my`, {wrapper: WrapperClass.NO_BACKGROUND}));
myRouter.get(`/comments`, (req, res) => res.render(`my/comments`, {wrapper: WrapperClass.NO_BACKGROUND}));
myRouter.get(`/new-post`, (req, res) => res.render(`my/new-post`));
myRouter.get(`/categories`, (req, res) => res.render(`my/categories`, {wrapper: WrapperClass.NO_BACKGROUND}));

module.exports = myRouter;
