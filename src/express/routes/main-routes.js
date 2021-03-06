'use strict';
const {WrapperClass, ErrorType} = require(`../../constants`);

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRouter = new Router();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {count, articles},
    categories,
    topComments,
    mostCommented,
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories({withCount: true}),
    api.getNewComments(),
    api.getMostCommented(),
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main/main`, {
    articles,
    categories,
    topComments,
    mostCommented,
    page,
    user,
    totalPages});
});


mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const query = req.query.search;
  try {
    const results = await api.search(query);
    res.render(`main/search`, {
      wrapper: WrapperClass.COLOR,
      user,
      results,
      query
    });
  } catch (error) {
    res.render(`main/search`, {
      wrapper: WrapperClass.COLOR,
      user,
      results: [],
      query: query ? query : ``
    });
  }
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;
  const userData = {
    avatar: file ? file.filename : ``,
    name: `${body.name} ${body.surname}`,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`main/sign-up`, {
      user,
      errorType: ErrorType.REGISTER_WRONG,
      validationMessages
    });
  }
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`main/login`, {
      user,
      errorType: ErrorType.LOGIN_WRONG,
      email: req.body[`email`],
      validationMessages
    });
  }
});

mainRouter.get(`/404`, (req, res) => {
  const {user} = req.session;
  res.render(`errors/404`, {user, wrapper: WrapperClass.COLOR});
});
mainRouter.get(`/500`, (req, res) => {
  const {user} = req.session;
  res.render(`errors/500`, {user, wrapper: WrapperClass.COLOR});
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  req.session.save(() => {
    res.redirect(`/`);
  });
});

module.exports = mainRouter;
