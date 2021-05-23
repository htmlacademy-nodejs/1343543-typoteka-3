'use strict';

const fs = require(`fs/promises`);
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  getRandomDate,
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const {
  ExitCode,
  MAX_ID_LENGTH,
  MAX_COMMENTS
} = require(`../../constants`);

const FILE_NAME = `mocks.json`;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

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

const CategoriesQuantity = {
  MIN: 1,
  MAX: 3
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

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateOffers = (params) => {
  const {count, titles, sentences, categories, comments} = params;

  if (count > MocksCount.MAX) {
    console.error(`Не больше 1000 публикаций`);
    process.exit(ExitCode.error);
  }

  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(DateCreation.MIN, DateCreation.MAX),
    announce: getRandomFromList(sentences, AnnounceQuantity.MIN, AnnounceQuantity.MAX, true),
    fullText: getRandomFromList(sentences, FullQuantity.MIN, FullQuantity.MAX, true),
    category: getRandomFromList(categories, CategoriesQuantity.MIN, CategoriesQuantity.MAX, false),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const readContent = async (filePath) => {
      try {
        const content = await fs.readFile(filePath, `utf8`);
        return content.split(`\n`);
      } catch (err) {
        console.error(chalk.red(err));
        return [];
      }
    };

    const [sentences, titles, categories, comments] = await Promise.all([
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);

    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || MocksCount.DEFAULT;
    const content = JSON.stringify(generateOffers({count: countOffer, sentences, titles, categories, comments}));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};

