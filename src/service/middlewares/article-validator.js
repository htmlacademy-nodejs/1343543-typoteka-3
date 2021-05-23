'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [`title`, `createdDate`, `announce`, `fullText`, `category`];

module.exports = (req, res, next) => {
  const newAricle = req.body;
  const keys = Object.keys(newAricle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  next();
};
