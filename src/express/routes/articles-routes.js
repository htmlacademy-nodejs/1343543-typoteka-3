'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray} = require(`../../utils`);
const { text } = require("body-parser");

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

const upload = multer({storage});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`articles/post-edit`, {
    article,
    categories
  });
});

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/post-add`, {categories});
});

articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`));

articlesRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  // const articleData = {
  //   photo: file ? file.filename : ``,
  //   date: body.date,
  //   title: body.title,
  //   announcement: body.announcement,
  //   fulltext: body[`full-text`],
  //   // TODO - допилить потом, category: ensureArray(body.category)
  // };

  const articleData = {
    category: [`Котики`],
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    createdDate: body.date,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

module.exports = articlesRouter;
