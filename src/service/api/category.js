'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const categories = await service.findOne(categoryId);
    res.status(HttpCode.OK)
      .json(categories);
  });
};
