'use strict';

const Alias = require(`../models/alias`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  findNewest() {
    const include = [
      {
        model: this._User,
        as: Alias.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      },
    ];
    return this._Comment.findAll({
      limit: 4,
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });
  }
}

module.exports = CommentService;
