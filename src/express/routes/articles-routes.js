'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {prepareErrors, ensureArray} = require(`../../utils`);
const {ErrorType} = require(`../../constants`);
const api = require(`../api`).getAPI();

const ARTICLES_PER_PAGE = 8;

const articlesRouter = new Router();
const csrfProtection = csrf();

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

// открыть статьи по категориям
articlesRouter.get(`/category/:id`, async (req, res) => {
  const categoryId = req.params.id;
  const {user} = req.session;

  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  // получить инфу для шапки
  // получить текущую категорию
  // получить список статей с категориями
  const [categories, currentCategory, {count, articlesByCategory}] = await Promise.all([
    api.getCategories({withCount: true}),
    api.getCategory(categoryId),
    api.getArticlesByCategory({categoryId, limit, offset})
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`articles/articles-by-category`, {
    categories,
    currentCategory,
    articles: articlesByCategory,
    count,
    page,
    totalPages,
    user
  });
});

// открыть страницу редактирования статьи
articlesRouter.get(`/edit/:id`, auth, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories({withCount: false})
  ]);

  res.render(`articles/post-edit`, {
    id,
    user,
    article,
    categories,
  });
});

// открыть страницу добавления статьи
articlesRouter.get(`/add`, auth, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories({withCount: false});
  res.render(`articles/post-add`, {categories, user});
});

// открыть страницу статьи
articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;

  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories({withCount: true})
  ]);

  res.render(`articles/post`, {
    article,
    categories,
    user,
    csrfToken: req.csrfToken(),
  });
});

// добавить статью
articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  console.log(body);

  const articleData = {
    picture: file ? file.filename : ``,
    categories: ensureArray(body.categories),
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    userId: user.id
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories({withCount: true});
    res.render(`articles/post-add`, {categories, errorType: ErrorType.ARTICLE_ADD, user, validationMessages});
  }
});

// редактировать статью
articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const {body, file} = req;

  const photo = body.photo ? body.photo : ``;

  const articleData = {
    picture: file ? file.filename : photo,
    categories: ensureArray(body.categories),
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    userId: user.id,
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);

    res.render(`articles/post-edit`, {
      id,
      article,
      user,
      errorType: ErrorType.ARTICLE_EDIT,
      validationMessages,
      categories
    });
  }
});

// добавить комментарий к статье
articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  try {
    await api.createComment(id, {userId: user.id, text: req.body.message});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await api.getArticle(id, true);
    const [categories] = await Promise.all([
      api.getCategories(true)
    ]);
    res.render(`articles/post`, {article, id, categories, errorType: ErrorType.COMMENT, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

module.exports = articlesRouter;
