'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const {withCount} = req.query;

    const categories = await service.findAll(withCount);

    res.status(HttpCode.OK)
      .json(categories);
  });

  route.post(`/`, async (req, res) => {
    const categoryName = req.body.data;
    const result = await service.create(categoryName);

    res.status(HttpCode.OK).json(result);
  });

  route.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const category = await service.findOne(categoryId);
    const {count, articlesByCategory} = await service.findPage(categoryId, limit, offset);

    res.status(HttpCode.OK)
      .json({
        category,
        count,
        articlesByCategory
      });
  });
};
