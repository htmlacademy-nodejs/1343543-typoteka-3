'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    const result = limit || offset ?
      await articleService.findPage({limit, offset, comments}) :
      await articleService.findAll(comments);

    res.status(HttpCode.OK).json(result);
  });

  route.get(`/commented`, async (req, res) => {
    const articles = {};
    articles.commented = await articleService.findLimit({limit: 4, withComments: true});

    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/comments`, async (req, res) => {
    const result = await commentService.findNewest();

    res.status(HttpCode.OK).json(result);
  });

  route.get(`/commentsAll`, async (req, res) => {
    const result = await commentService.findFull();
    return res.status(HttpCode.OK).json(result);
  });

  route.delete(`/comments/:id`, async (req, res) => {
    const {id} = req.params;
    const deleted = await commentService.drop(id);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK).json({});
  });

  route.get(`/category/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const {count, articlesByCategory} = await articleService.findCategoryPage(categoryId, limit, offset);

    res.status(HttpCode.OK)
      .json({
        count,
        articlesByCategory
      });
  });

  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;

    const article = await articleService.findOne(articleId, true);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, [routeParamsValidator, articleValidator], async (req, res) => {
    const {articleId} = req.params;

    const updated = await articleService.update(articleId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }
    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  route.get(`/:articleId/comments`, [routeParamsValidator, articleExist(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    res.status(HttpCode.OK)
      .json(comments);

  });

  route.delete(`/:articleId/comments/:commentId`, [routeParamsValidator, articleExist(articleService)], async (req, res) => {
    const {articleId, commentId} = req.params;

    const comment = await commentService.findOne(commentId, articleId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const deleted = await commentService.drop(commentId);

    return res.status(HttpCode.OK)
      .json(deleted);
  });

  route.post(`/:articleId/comments`, [routeParamsValidator, articleExist(articleService), commentValidator], async (req, res) => {
    const {articleId} = req.params;

    const comment = await commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
