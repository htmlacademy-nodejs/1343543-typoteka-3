'use strict';

const {Router} = require(`express`);
const offersRouter = new Router();

offersRouter.get(`/`, (req, res) => res.send(`/my`));
offersRouter.get(`/comments`, (req, res) => res.send(`/my/comments`));

module.exports = offersRouter;
