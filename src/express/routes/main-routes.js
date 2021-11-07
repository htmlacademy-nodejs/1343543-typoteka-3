'use strict';
const {WrapperClass} = require(`../../constants`);

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRouter = new Router();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const OFFERS_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = OFFERS_PER_PAGE;

  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);

  res.render(`main/main`, {articles, categories, page, totalPages});
});


mainRouter.get(`/register`, (req, res) => res.render(`main/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`main/login`));
mainRouter.get(`/search`, async (req, res) => {
  const query = req.query.search;
  try {
    const results = await api.search(query);
    res.render(`main/search`, {
      wrapper: WrapperClass.COLOR,
      results,
      query
    });
  } catch (error) {
    res.render(`main/search`, {
      wrapper: WrapperClass.COLOR,
      results: [],
      query: query ? query : ``
    });
  }
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  console.log(body);
  const userData = {
    avatar: file ? file.filename : ``,
    name: body.name,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`main/sign-up`, {validationMessages});
  }
});

mainRouter.get(`/404`, (req, res) => res.render(`errors/404`, {wrapper: WrapperClass.COLOR}));
mainRouter.get(`/500`, (req, res) => res.render(`errors/500`, {wrapper: WrapperClass.COLOR}));

module.exports = mainRouter;
