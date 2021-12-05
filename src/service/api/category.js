'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryValidator = require(`../middlewares/category-validator`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const {withCount} = req.query;

    const categories = await service.findAll(withCount);

    res.status(HttpCode.OK)
      .json(categories);
  });

  // добавление новой категории
  route.post(`/`, categoryValidator, async (req, res) => {
    // TODO а не добавить ли сюда проверку что добавляемая категория существует?
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

  route.delete(`/:categoryId`, async (req, res) => {
    const {categoryId: id} = req.params;
    const category = await service.findSingle(id);

    if (category.count > 1) {
      console.log(`Невозможно удалить непустую категорию`);
    } else {
      console.log(`Удаление возможно`);
      await service.drop(id);
    }


  });
};
