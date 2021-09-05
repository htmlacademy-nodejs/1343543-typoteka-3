'use strict';

const fs = require(`fs/promises`);
const chalk = require(`chalk`);

const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const {
  ExitCode,
  MAX_COMMENTS
} = require(`../../constants`);

const FILE_NAME = `fill-db2.sql`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_PICTURES_PATH = `./data/pictures.txt`;

const AnnounceQuantity = {
  MIN: 1,
  MAX: 5,
};

const FullQuantity = {
  MIN: 1,
  MAX: 10
};

const MocksCount = {
  DEFAULT: 1,
  MAX: 1000
};

const users = [
  {
    email: `hannibal@a-team.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `John`,
    lastName: `Smith`,
    avatar: `avatar-1.jpg`
  },
  {
    email: `face@a-team.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Templeton`,
    lastName: `Peck`,
    avatar: `avatar-2.jpg`
  },
  {
    email: `b.a@a-team.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `Bosco`,
    lastName: `Baracus`,
    avatar: `avatar-3.jpg`
  },
  {
    email: `howling.mad@a-team.com`,
    passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
    firstName: `H.M.`,
    lastName: `Murdock`,
    avatar: `avatar-4.jpg`
  }
];

const getRandomFromList = (list, minLength, maxLength, isString) => {
  const result = shuffle(list).slice(0, getRandomInt(minLength, maxLength));
  if (isString) {
    return result.join(` `);
  }
  return result;
};

const generateComments = (params) => {
  const {count, commentSentences, articleId, userCount} = params;

  return Array(count).fill({}).map(() => ({
    id: getRandomInt(1, userCount),
    articleId,
    text: shuffle(commentSentences)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }));
};

const generateArticles = (params) => {
  const {
    count,
    titles,
    sentences,
    categoryCount,
    userCount,
    commentSentences,
    pictures
  } = params;

  if (count > MocksCount.MAX) {
    console.error(`Не больше 1000 публикаций`);
    process.exit(ExitCode.ERROR);
  }

  return Array(count).fill({}).map((_, index) => ({
    comments: generateComments({
      count: getRandomInt(1, MAX_COMMENTS),
      articleId: index + 1,
      userCount,
      commentSentences
    }),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: getRandomFromList(sentences, AnnounceQuantity.MIN, AnnounceQuantity.MAX, true),
    fullText: getRandomFromList(sentences, FullQuantity.MIN, FullQuantity.MAX, true),
    picture: `${getRandomFromList(pictures, 1, 1, true)}@1x.jpg`,
    category: getRandomInt(1, categoryCount),
    userId: getRandomInt(1, userCount),
  }));
};

module.exports = {
  name: `--fill`,
  async run(args) {

    const readContent = async (filePath) => {
      try {
        const content = await fs.readFile(filePath, `utf8`);
        return content.trim().split(`\n`);
      } catch (err) {
        console.error(chalk.red(err));
        return [];
      }
    };

    const [sentences, titles, categories, commentSentences, pictures] = await Promise.all([
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_COMMENTS_PATH),
      readContent(FILE_PICTURES_PATH),
    ]);

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || MocksCount.DEFAULT;
    const articles = generateArticles({
      count: countArticles,
      sentences,
      titles,
      categoryCount: categories.length,
      userCount: users.length,
      commentSentences,
      pictures
    });

    const comments = articles.flatMap((article) => article.comments);

    const articleCategories = articles.map((article, index) => (
      {articleId: index + 1, categoryId: article.category}
    ));

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, announce, fullText, picture, userId}) =>
          `('${title}', '${announce}', '${fullText}', '${picture}', ${userId})`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, id, articleId}) =>
          `('${text}', ${id}, ${articleId})`
    ).join(`,\n`);

    const content = `INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};

INSERT INTO categories(name) VALUES
${categoryValues};

ALTER TABLE articles DISABLE TRIGGER ALL;

INSERT INTO articles(title, announce, full_text, picture, user_id) VALUES
${articleValues};

ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE article_categories DISABLE TRIGGER ALL;

INSERT INTO article_categories(article_id, category_id) VALUES
${articleCategoryValues};

ALTER TABLE article_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;

INSERT INTO COMMENTS(text, user_id, offer_id) VALUES
${commentValues};

ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};

