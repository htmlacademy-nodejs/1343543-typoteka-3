"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Музыка`,
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const mockData = [
  {
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Мне кажется или я уже читал это где-то? `},
      {
        "user": `petrov@example.com`,
        "text": `Это где ж такие красоты? Совсем немного...`},
      {
        "user": `ivanov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`
      }],
    "title": `Ёлки. История деревьев`,
    "announce": `Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Первая большая ёлка была установлена только в 1938 году. Программировать не настолько сложно, как об этом говорят. Это один из лучших рок-музыкантов.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха.`,
    "categories": [`Разное`, `Программирование`],
    "user": `ivanov@example.com`,
  },
  {
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Это где ж такие красоты?`
      }
    ],
    "title": `Ёлки. История деревьев`,
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов.`,
    "categories": [`Музыка`]},
  {
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Согласен с автором!`
      },
      {
        "user": `petrov@example.com`,
        "text": `Совсем немного... Это где ж такие красоты?`
      }
    ],
    "title": `Как перестать беспокоиться и начать жить`,
    "announce": `Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха.`,
    "categories": [`За жизнь`, `Программирование`, `Железо`]},
  {
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы! Согласен с автором!`
      },
      {
        "user": `ivanov@example.com`,
        "text": ` Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Хочу такую же футболку :-)`
      }
    ],
    "title": `Что такое золотое сечение`,
    "announce": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?, Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов.`,
    "categories": [`Кино`, `За жизнь`]},
  {
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Это где ж такие красоты?`
      },
      {
        "user": `ivanov@example.com`,
        "text": ` Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы!`
      }
    ],
    "title": `Самый лучший музыкальный альбом этого года`,
    "announce": `Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Он написал больше 30 хитов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "categories": [`За жизнь`]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockData, users: mockUsers});
  const app = express();
  app.use(express.json());
  article(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`article's title is "Ёлки. История деревьев"`, () => expect(response.body.title).toBe(`Ёлки. История деревьев`));
});

describe(`API creates an article if data is valid`, () => {

  const newarticle = {
    categories: [1, 2],
    title: `Тестовый заголвоок который должен быть длинным`,
    announce: `Дам погладить котика. Котик пушистый, веселый, знает 3 языка программирования`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    userId: 1,
  };
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newarticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API refuses to create an article if data is invalid`, () => {

  const newarticle = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `article`,
    sum: 100500
  };
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newarticle)) {
      const badarticle = {...newarticle};
      delete badarticle[key];
      await request(app)
        .post(`/articles`)
        .send(badarticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

});

describe(`API changes existent article`, () => {
  const newArticle = {
    categories: [2],
    title: `Длинный как вытянувшийся котик заголовок`,
    announce: `Дам погладить котика. Может верстать, кодить, гладить и мяукать`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    userId: 1
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/2`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/2`)
    .expect((res) => expect(res.body.title).toBe(`Длинный как вытянувшийся котик заголовок`))
  );
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();

  const newArticle = {
    categories: [2],
    title: `Длинный как вытянувшийся котик заголовок`,
    announce: `Дам погладить котика. Может верстать, кодить, гладить и мяукать`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    userId: 1
  };

  return request(app)
    .put(`/articles/20`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {

  const app = await createAPI();

  const invalidarticle = {
    categories: [1, 2],
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/articles/20`)
    .send(invalidarticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`article count is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent article`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/20`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given article`, () => {

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment's id is "Мне кажется или я уже читал это где-то?"`, () => expect(response.body[0].text).toBe(`Мне кажется или я уже читал это где-то? `));

});


describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`,
    userId: 1,
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles/3/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/3/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

// test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {

//   const app = await createAPI();

//   return request(app)
//     .post(`/articles/20/comments`)
//     .send({
//       text: `Валидный текст комментария больше 20 символов`,
//       userId: 1
//     })
//     .expect(HttpCode.NOT_FOUND);

// });

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {

  const app = await createAPI();

  return request(app)
    .post(`/articles/2/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 2 now`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

});

test(`API refuses to delete non-existent comment`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/4/comments/100`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/20/comments/1`)
    .expect(HttpCode.NOT_FOUND);

});
