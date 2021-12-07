'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryValidator = require(`../middlewares/category-validator`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/category`, route);

  // получить все категории
  route.get(`/`, async (req, res) => {
    const {withCount} = req.query;

    const categories = await service.findAll({withCount});

    res.status(HttpCode.OK)
      .json(categories);
  });

  // добавление новой категории
  route.post(`/`, categoryValidator, async (req, res) => {
    const categoryName = req.body.data;
    const result = await service.create(categoryName);

    res.status(HttpCode.OK).json(result);
  });

  // получить список статей категории
  // вернуть активную категорию
  route.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const category = await service.findOne({id: categoryId, withCount: false});
    const {count, articlesByCategory} = await service.findPage(categoryId, limit, offset);

    res.status(HttpCode.OK)
      .json({
        category,
        count,
        articlesByCategory
      });
  });

  // удаление категории
  route.delete(`/:categoryId`, async (req, res) => {
    const {categoryId: id} = req.params;
    const category = await service.findOne({id, withCount: true});

    if (category.count > 1) {
      console.log(`Невозможно удалить непустую категорию`);
      return res.status(HttpCode.FORBIDDEN)
        .send(`Unable to delete not empty category`);
    }

    const deleted = await service.drop(id);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK).json(deleted);
  });

  // обновление новой категории
  route.put(`/:categoryId`, categoryValidator, async (req, res) => {
    const {categoryId: id} = req.params;
    const categoryName = req.body.data;
    const category = await service.findOne({id, withCount: true});

    if (!category) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const updated = await service.update(id, categoryName);

    return res.status(HttpCode.OK).json(updated);
  });
};
