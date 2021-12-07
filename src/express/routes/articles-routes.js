'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {prepareErrors} = require(`../../utils`);

const api = require(`../api`).getAPI();
const articlesRouter = new Router();

const csrfProtection = csrf();

const ARTICLES_PER_PAGE = 8;

const getAddArticleData = () => {
  return api.getCategories({withCount: true});
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

// //
// get
// //

// статьи по категориям
articlesRouter.get(`/category/:id`, async (req, res) => {
  const categoryId = req.params.id;
  const {user} = req.session;

  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [categories, {category, count, articlesByCategory}] = await Promise.all([
    api.getCategories({withCount: true}),
    api.getCategory({categoryId, limit, offset})
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  const articles = {
    category,
    current: articlesByCategory
  };

  res.render(`articles/articles-by-category`, {
    fullView: true,
    categories,
    count,
    articles,
    page,
    totalPages,
    user
  });

  // const [articles, categories, activeCategory] = await Promise.all([
  //   api.getArticlesWithCategory(categoryId),
  //   api.getCategories(true),
  //   api.getOneCategory(categoryId)
  // ]);

  // res.render(`articles/articles-by-category`, {articles, categories, user, activeCategory});
});

articlesRouter.get(`/edit/:id`, auth, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories({withCount: false})
  ]);

  res.render(`articles/post-edit`, {
    id,
    article,
    categories,
  });
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const csrfToken = req.csrfToken();
  const categories = await getAddArticleData();
  res.render(`articles/post-add`, {categories, user, csrfToken});
});

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

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;

  // TODO поправить странный код
  const entries = Object.entries(req.body);
  const selectedCategories = entries.reduce((acc, element) => {
    if (element[0][0] === `c`) {
      acc.push(Number(element[1]));
    }
    return acc;
  }, []);

  const articleData = {
    picture: file ? file.filename : ``,
    categories: selectedCategories,
    title: req.body.title,
    announce: req.body.announcement,
    fullText: req.body[`full-text`],
    userId: user.id
  };

  console.log(articleData);

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
    res.render(`articles/post-add`, {categories, validationMessages});
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const {body, file} = req;

  // зарефакторить
  const entries = Object.entries(req.body);
  const selectedCategories = entries.reduce((acc, element) => {
    if (element[0][0] === `c`) {
      acc.push(Number(element[1]));
    }
    return acc;
  }, []);

  const articleData = {
    picture: file ? file.filename : ``,
    categories: selectedCategories,
    title: req.body.title,
    announce: req.body.announcement,
    fullText: req.body[`full-text`],
    userId: user.id,
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

articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  try {
    await api.createComment(id, {userId: user.id, text: req.body.message});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await getViewArticleData(id, true);
    const [categories] = await Promise.all([
      api.getCategories(true)
    ]);
    res.render(`articles/post`, {article, id, categories, validationMessages, csrfToken: req.csrfToken()});
  }
});

module.exports = articlesRouter;
