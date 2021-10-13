'use strict';

const fs = require(`fs/promises`);
const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);


const {
  getRandomDate,
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const {
  ExitCode,
  MAX_COMMENTS
} = require(`../../constants`);

const logger = getLogger({});

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_PICTURES_PATH = `./data/pictures.txt`;

const DateCreation = {
  MIN: new Date(new Date().setDate(new Date().getDate() - 90)),
  MAX: new Date()
};

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

const getRandomFromList = (list, minLength, maxLength, isString) => {
  const result = shuffle(list).slice(0, getRandomInt(minLength, maxLength));
  if (isString) {
    return result.join(` `);
  }
  return result;
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    logger.error(`Error when reading file: ${err.message}`);
    return [];
  }
};

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = (params) => {
  const {
    count,
    titles,
    sentences,
    categories,
    comments,
    pictures
  } = params;

  if (count > MocksCount.MAX) {
    console.error(`Не больше 1000 публикаций`);
    process.exit(ExitCode.ERROR);
  }

  return Array(count).fill({}).map(() => ({
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(DateCreation.MIN, DateCreation.MAX),
    announce: getRandomFromList(sentences, AnnounceQuantity.MIN, AnnounceQuantity.MAX, true),
    fullText: getRandomFromList(sentences, FullQuantity.MIN, FullQuantity.MAX, true),
    picture: `${getRandomFromList(pictures, 1, 1, true)}`,
    categories: getRandomSubarray(categories),
  }));
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
    logger.info(`Connection to database established`);

    const [sentences, titles, categories, comments, pictures] = await Promise.all([
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_COMMENTS_PATH),
      readContent(FILE_PICTURES_PATH),
    ]);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || MocksCount.DEFAULT;
    const articles = generateArticles({
      count: countArticle,
      sentences,
      titles,
      categories,
      comments,
      pictures
    });

    return initDatabase(sequelize, {articles, categories});
  }
};

