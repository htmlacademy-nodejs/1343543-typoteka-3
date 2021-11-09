'use strict';

const Alias = require(`../models/alias`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [
      Alias.CATEGORIES,
      {
        model: this._User,
        as: Alias.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [
          {
            model: this._User,
            as: Alias.User,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }
    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });
    return articles.map((item) => item.get());
  }

  async findAllWithCategory({categoryId}) {
    const include = [
      Alias.CATEGORIES,
      Alias.COMMENTS,
      {
        model: this._ArticleCategory,
        where: {
          CategoryId: categoryId,
        },
        as: Alias.ARTICLE_CATEGORIES,
        attributes: []
      }
    ];

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });
    return articles.map((item) => item.get());
  }

  findOne(id, needComments) {
    const include = [
      Alias.CATEGORIES,
      {
        model: this._User,
        as: Alias.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [
          {
            model: this._User,
            as: Alias.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }
    return this._Article.findByPk(id, {include});
  }

  async findPage({limit, offset, comments}) {
    const include = [
      Alias.CATEGORIES,
      {
        model: this._User,
        as: Alias.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];
    if (comments) {
      include.push(Alias.COMMENTS);
    }
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });
    return {count, articles: rows};
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

}

module.exports = ArticleService;
