'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/`, (req, res) => res.send(`/my`));
offersRouter.get(`/comments`, (req, res) => res.render(`my/comments`, {wrapper: `wrapper wrapper--nobackground`}));

module.exports = offersRouter;
