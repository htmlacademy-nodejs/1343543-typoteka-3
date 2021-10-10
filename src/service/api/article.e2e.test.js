"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Музыка`,
  `Деревья`,
  `За жизнь`
];

const mockData = [
  {
    "comments": [
      {
        "text": `Хочу такую же футболку :-)`
      },
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      }
    ],
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Программировать не настолько сложно, как об этом говорят. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "categories": [
      `Кино`,
      `Программирование`,
      `Разное`
    ]
  },
  {
    "comments": [
      {
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "text": `Планируете записать видосик на эту тему? Согласен с автором! Хочу такую же футболку :-)`
      }
    ],
    "title": `Рок — это протест`,
    "announce": `Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Простые ежедневные упражнения помогут достичь успеха.`,
    "categories": [
      `Деревья`,
      `IT`,
      `Программирование`
    ]
  },
  {
    "comments": [
      {
        "text": ` Совсем немного... Согласен с автором!`
      },
      {
        "text": `Это где ж такие красоты? Хочу такую же футболку :-) Плюсую, но слишком много буквы!`
      },
      {
        "text": `Планируете записать видосик на эту тему?`
      }
    ],
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "categories": [
      `Без рамки`,
      `Кино`
    ]
  },
  {
    "comments": [
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "text": `Это где ж такие красоты? Планируете записать видосик на эту тему?`
      },
      {
        "text": `Мне кажется или я уже читал это где-то?`
      }
    ],
    "title": `Рок — это протест`,
    "announce": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Из под его пера вышло 8 платиновых альбомов.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "categories": [
      `Железо`
    ]
  },
  {
    "comments": [
      {
        "text": `Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      },
      {
        "text": `Мне кажется или я уже читал это где-то? Согласен с автором!`
      },
      {
        "text": `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`
      }
    ],
    "title": `Как перестать беспокоиться и начать жить`,
    "announce": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов.`,
    "categories": [
      `Разное`
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockData});
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

  test(`First article's title equals "Лучшие рок-музыканты 20-века"`, () => expect(response.body[0].id).toBe(`Лучшие рок-музыканты 20-века`));

});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`article's title is "Лучшие рок-музыканты 20-века"`, () => expect(response.body.title).toBe(`Лучшие рок-музыканты 20-века`));

});

describe(`API creates an article if data is valid`, () => {

  const newarticle = {
    categories: [1, 2],
    title: `Дам погладить котика`,
    announce: `Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    createdDate: `2021-05-18T05:51:04.976Z`
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
  const newarticle = {
    categories: [2],
    title: `Дам погладить котика`,
    announce: `Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
  };

  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/2`)
      .send(newarticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/2`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );

});

test(`API returns status code 404 when trying to change non-existent article`, async () => {

  const app = await createAPI();

  const validarticle = {
    categories: [3],
    title: `валидный`,
    announce: `объект`,
    fullText: `заметки`,
  };

  return request(app)
    .put(`/articles/20`)
    .send(validarticle)
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
      .get(`/articles/2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));

  test(`First comment's id is "Мне кажется или я уже читал это где-то?"`, () => expect(response.body[0].text).toBe(`Мне кажется или я уже читал это где-то?`));

});


describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
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
    .expect((res) => expect(res.body.length).toBe(3))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {

  const app = await createAPI();

  return request(app)
    .post(`/articles/20/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {

  const app = createAPI();

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
      .delete(`/articles/2/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/2/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );

});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

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
