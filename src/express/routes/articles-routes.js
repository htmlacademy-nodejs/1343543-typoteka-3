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
  return api.getOffer(articleId, comments);
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
    categories
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
  const articleData = {
    // TODO тут будет поле photo, когда я пойму почему multer падает
    // TODO непонятно каким образом должны выбираться категории, кнопка в форме не работает, временно захардкодил котиков
    categories: [1],
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
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file ? file.filename : body[`old-image`],
    category: [`Котики`],
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    createdDate: body.date,
  };
  try {
    await api.editOffer(id, articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render(`offers/ticket-edit`, {id, article, validationMessages, categories});
  }
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/offers/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const offer = await getViewArticleData(id, true);
    res.render(`offers/ticket`, {offer, id, validationMessages});
  }
});

module.exports = articlesRouter;
