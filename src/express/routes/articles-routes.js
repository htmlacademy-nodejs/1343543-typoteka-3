'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {prepareErrors} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const articlesRouter = new Router();

const api = require(`../api`).getAPI();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const getAddArticleData = () => {
  return api.getCategories();
};

const getViewArticleData = (articleId, comments) => {
  return api.getArticle(articleId, comments);
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

const upload = multer({storage});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const categoryId = req.params.id;
  const [articles, categories, activeCategory] = await Promise.all([
    api.getArticlesWithCategory(categoryId),
    api.getCategories(true),
    api.getOneCategory(categoryId)
  ]);

  res.render(`articles/articles-by-category`, {articles, categories, activeCategory});
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  res.render(`articles/post-edit`, {
    id,
    article,
    categories,
  });
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await getAddArticleData();
  res.render(`articles/post-add`, {categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(true)
  ]);
  res.render(`articles/post`, {
    article,
    categories
  });
});

articlesRouter.post(`/add`, upload.single(`photo`), async (req, res) => {
  const entries = Object.entries(req.body);
  const selectedCategories = entries.reduce((acc, element) => {
    if (element[0][0] === `c`) {
      acc.push(Number(element[1]));
    }
    return acc;
  }, []);
  const articleData = {
    // TODO тут будет поле photo, когда я пойму почему multer падает
    categories: selectedCategories,
    title: req.body.title,
    announce: req.body.announcement,
    fullText: req.body[`full-text`],
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
    res.render(`articles/post-add`, {categories, validationMessages});
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {id} = req.params;
  // зарефакторить
  const entries = Object.entries(req.body);
  const selectedCategories = entries.reduce((acc, element) => {
    if (element[0][0] === `c`) {
      acc.push(Number(element[1]));
    }
    return acc;
  }, []);

  const articleData = {
    categories: selectedCategories,
    title: req.body.title,
    announce: req.body.announcement,
    fullText: req.body[`full-text`],
  };
  try {
    await api.editArticle(id, articleData);
    res.redirect(`/`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render(`articles/post-edit`, {id, article, validationMessages, categories});
  }
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await getViewArticleData(id, true);
    res.render(`articles/ticket`, {article, id, validationMessages});
  }
});

module.exports = articlesRouter;
