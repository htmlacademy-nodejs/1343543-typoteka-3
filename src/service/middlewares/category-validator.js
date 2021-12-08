'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorCategoryMessage = {
  CATEGORY_MIN: `Имя категории содержит меньше 5 символов`,
  CATEGORY_MAX: `Имя категории не может содержать более 30 символов`,
};

const schema = Joi.object({
  data: Joi.string().min(5).max(30).required().messages({
    'string.min': ErrorCategoryMessage.CATEGORY_MIN,
    'string.max': ErrorCategoryMessage.CATEGORY_MAX,
  })
});

module.exports = (req, res, next) => {
  const categoryName = req.body;

  const {error} = schema.validate(categoryName);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
