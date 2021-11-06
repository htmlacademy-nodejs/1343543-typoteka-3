'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorOfferMessage = {
  CATEGORIES: `Не выбрана ни одна категория статьи`,
  TITLE_MIN: `Заголовок содержит меньше 30 символов`,
  TITLE_MAX: `Заголовок не может содержать более 250 символов`,
  ANNOUNCE_MIN: `Анонс публикации содержит меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс публикации не может содержать более 250 символов`,
  TEXT_MAX: `Полный текст публикации не может содержать более 1000 символов`,
  TYPE: `Не выбран ни один тип объявления`,
  SUM: `Сумма не может быть меньше 100`
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorOfferMessage.CATEGORIES
      })
  ).min(1).required(),
  title: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorOfferMessage.TITLE_MIN,
    'string.max': ErrorOfferMessage.TITLE_MAX
  }),
  announce: Joi.string().min(30).max(250).required().messages({
    'string.min': ErrorOfferMessage.ANNOUNCE_MIN,
    'string.max': ErrorOfferMessage.ANNOUNCE_MAX
  }),
  fullText: Joi.string().max(1000).messages({
    'string.max': ErrorOfferMessage.TEXT_MAX
  }),
});

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const {error} = schema.validate(newArticle, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
