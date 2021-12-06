'use strict';
const {WrapperClass, ErrorType} = require(`../../constants`);

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();
const auth = require(`../middlewares/auth`);
const {prepareErrors} = require(`../../utils`);

// /////
// Комментарии (my/comments)
// /////

// открыть страницу с комментариями
myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const comments = await api.getComments();

  res.render(`my/comments`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    comments,
    user
  });
});

// удалить комментарий
myRouter.get(`/comments/:id`, auth, async (req, res) => {
  const {id} = req.params;
  await api.removeComment(id);

  res.redirect(`/my/comments/`);
});

// /////
// Публикации (my)
// /////
myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({});
  res.render(`my/my`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    articles,
    user
  });
});

// myRouter.get(`/:id`, auth, async (req, res) => {
//   const {id} = req.params;
//   await api.removeArticle(id);
//   res.redirect(`/my`);
// });


// //////
// Категории (my/categories)
// //////

// открыть страницу
myRouter.get(`/categories`, auth, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories({withCount: false});
  res.render(`my/categories`, {
    wrapper: WrapperClass.NO_BACKGROUND,
    categories,
    user
  });
});

// добавить категорию
myRouter.post(`/categories`, auth, async (req, res) => {
  const {user} = req.session;
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
      user
    });
  }
});

// удалить или сохранить категорию
myRouter.post(`/categories/:id`, auth, async (req, res) => {
  const action = req.body.button;
  const {user} = req.session;
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
        user,
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
        user
      });
    }
  }
});

module.exports = myRouter;
