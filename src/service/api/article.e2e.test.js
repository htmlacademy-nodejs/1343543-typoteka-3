"use strict";

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `sWilm2`,
    "comments": [
      {
        "id": `csTpVf`,
        "text": `Хочу такую же футболку :-)`
      },
      {
        "id": `gkKY5n`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      }
    ],
    "title": `Лучшие рок-музыканты 20-века`,
    "createdDate": `2021-07-11T12:47:30.912Z`,
    "announce": `Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Программировать не настолько сложно, как об этом говорят. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.  Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха. Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "category": [
      `Кино`,
      `Программирование`,
      `Разное`
    ]
  },
  {
    "id": `utTM-H`,
    "comments": [
      {
        "id": `rMxQ7G`,
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "id": `2wEtew`,
        "text": `Планируете записать видосик на эту тему? Согласен с автором! Хочу такую же футболку :-)`
      }
    ],
    "title": `Рок — это протест`,
    "createdDate": `2021-06-23T20:44:00.631Z`,
    "announce": `Достичь успеха помогут ежедневные повторения. Простые ежедневные упражнения помогут достичь успеха. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "fullText": `Простые ежедневные упражнения помогут достичь успеха.`,
    "category": [
      `Деревья`,
      `IT`,
      `Программирование`
    ]
  },
  {
    "id": `fmu_ip`,
    "comments": [
      {
        "id": `LvGPMf`,
        "text": ` Совсем немного... Согласен с автором!`
      },
      {
        "id": `avk_lL`,
        "text": `Это где ж такие красоты? Хочу такую же футболку :-) Плюсую, но слишком много буквы!`
      },
      {
        "id": `SjFfdb`,
        "text": `Планируете записать видосик на эту тему?`
      }
    ],
    "title": `Лучшие рок-музыканты 20-века`,
    "createdDate": `2021-06-16T01:08:41.124Z`,
    "announce": `Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    "category": [
      `Без рамки`,
      `Кино`
    ]
  },
  {
    "id": `Z567GU`,
    "comments": [
      {
        "id": `4M0xeF`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "id": `5s_wdV`,
        "text": `Это где ж такие красоты? Планируете записать видосик на эту тему?`
      },
      {
        "id": `8fpvfK`,
        "text": `Мне кажется или я уже читал это где-то?`
      }
    ],
    "title": `Рок — это протест`,
    "createdDate": `2021-05-16T00:32:57.269Z`,
    "announce": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой. Золотое сечение — соотношение двух величин, гармоническая пропорция. Из под его пера вышло 8 платиновых альбомов.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Золотое сечение — соотношение двух величин, гармоническая пропорция. Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "category": [
      `Железо`
    ]
  },
  {
    "id": `roBBM7`,
    "comments": [
      {
        "id": `N5RWnl`,
        "text": `Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      },
      {
        "id": `8j2wiu`,
        "text": `Мне кажется или я уже читал это где-то? Согласен с автором!`
      },
      {
        "id": `kqssTL`,
        "text": `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...`
      }
    ],
    "title": `Как перестать беспокоиться и начать жить`,
    "createdDate": `2021-07-03T15:09:33.878Z`,
    "announce": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов.`,
    "category": [
      `Разное`
    ]
  }
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));

  test(`First article's id equals "sWilm2"`, () => expect(response.body[0].id).toBe(`sWilm2`));

});

describe(`API returns an article with given id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/sWilm2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`article's title is "Лучшие рок-музыканты 20-века"`, () => expect(response.body.title).toBe(`Лучшие рок-музыканты 20-века`));

});

describe(`API creates an article if data is valid`, () => {

  const newarticle = {
    category: `Котики`,
    title: `Дам погладить котика`,
    announce: `Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    createdDate: `2021-05-18T05:51:04.976Z`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newarticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newarticle)));

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
  const app = createAPI();

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
    category: `Котики`,
    title: `Дам погладить котика`,
    announce: `Дам погладить котика`,
    fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    createdDate: `2021-05-18T05:51:04.976Z`
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/utTM-H`)
      .send(newarticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newarticle)));

  test(`article is really changed`, () => request(app)
    .get(`/articles/utTM-H`)
    .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`))
  );

});

test(`API returns status code 404 when trying to change non-existent article`, () => {

  const app = createAPI();

  const validarticle = {
    category: `Это`,
    title: `валидный`,
    announce: `объект`,
    fullText: `объявления`,
    createdDate: `2021-05-18T05:51:04.976Z`
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validarticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {

  const app = createAPI();

  const invalidarticle = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidarticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/roBBM7`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`roBBM7`));

  test(`article count is 11 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(11))
  );
});

test(`API refuses to delete non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

describe(`API returns a list of comments to given article`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/sWilm2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));

  test(`First comment's id is "csTpVf"`, () => expect(response.body[0].id).toBe(`csTpVf`));

});


describe(`API creates a comment if data is valid`, () => {

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/sWilm2/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app)
    .get(`/articles/sWilm2/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {

  const app = createAPI();

  return request(app)
    .post(`/articles/sWilm2/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);

});

describe(`API correctly deletes a comment`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/sWilm2/comments/csTpVf`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`csTpVf`));

  test(`Comments count is 3 now`, () => request(app)
    .get(`/articles/sWilm2/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );

});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/GxdTgz/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

test(`API refuses to delete a comment to non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/kqME9j`)
    .expect(HttpCode.NOT_FOUND);

});
