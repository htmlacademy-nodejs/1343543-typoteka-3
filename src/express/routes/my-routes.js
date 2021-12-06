'use strict';
const {WrapperClass, ErrorType} = require(`../../constants`);

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();
const auth = require(`../middlewares/auth`);
const {prepareErrors} = require(`../../utils`);

myRouter.get(`/`, auth, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my/my`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    articles
  });
});

// /////
// Комментарии (my/comments)
// /////

// открыть страницу с комментариями
myRouter.get(`/comments`, auth, async (req, res) => {
  const comments = await api.getComments();
  res.render(`my/comments`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    comments,
  });
});

// /////
// Удалить комментарий
// /////
myRouter.get(`/comments/:id`, auth, async (req, res) => {
  const {id} = req.params;
  await api.removeComment(id);

  res.redirect(`/my/comments/`);
  // res.redirect(`/my/comments`);
});

// //////
// Категории (my/categories)
// //////

// открыть страницу
myRouter.get(`/categories`, auth, async (req, res) => {
  const categories = await api.getCategories({withCount: false});
  res.render(`my/categories`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    categories,
  });
});

// добавить категорию
myRouter.post(`/categories`, auth, async (req, res) => {
  const category = req.body[`add-category`];
  try {
    await api.createCategory(category);

    res.redirect(`/my/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories({withCount: false});

    res.render(`my/categories`, {
      categories,
      validationMessages,
      errorType: ErrorType.CATEGORY_ADD,
      wrapper: WrapperClass.NO_BACKGROUND,
    });
  }
});

// удалить или сохранить категорию
myRouter.post(`/categories/:id`, auth, async (req, res) => {
  const action = req.body.button;
  const {id} = req.params;
  console.log(req.body);

  // Кнопка удалить
  if (action === `delete`) {
    try {
      await api.removeCategory(id);

      res.redirect(`/my/categories`);
    } catch (errors) {
      const validationMessages = prepareErrors(errors);
      const categories = await api.getCategories({withCount: false});

      res.render(`my/categories`, {
        categories,
        validationMessages,
        errorType: ErrorType.CATEGORY_DELETE,
        wrapper: WrapperClass.NO_BACKGROUND,
      });
    }
  }

  // Кнопка сохранить
  if (action === `save`) {
    const category = req.body.category;

    try {
      await api.renameCategory(id, category);

      res.redirect(`/my/categories`);
    } catch (errors) {
      const validationMessages = prepareErrors(errors);
      const categories = await api.getCategories({withCount: false});

      res.render(`my/categories`, {
        categories,
        validationMessages,
        errorType: ErrorType.CATEGORY_UPDATE,
        wrapper: WrapperClass.NO_BACKGROUND,
      });
    }
  }
});

module.exports = myRouter;
