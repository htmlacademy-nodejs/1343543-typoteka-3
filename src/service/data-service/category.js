'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._Comments = sequelize.models.Comment;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Alias.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }

  async findOne(id, needCount) {
    return this._Category.findByPk(id);
  }

  // возвращает категорию со счётчиком
  async findSingle(id) {
    const result = await this._Category.findByPk(id, {
      where: {id},
      attributes: [
        `id`,
        `name`,
        [
          Sequelize.fn(
              `COUNT`,
              `*`
          ),
          `count`
        ]
      ],
      group: [Sequelize.col(`Category.id`)],
      include: [{
        model: this._ArticleCategory,
        as: Alias.ARTICLE_CATEGORIES,
        attributes: []
      }],
      raw: true,
    });
    return result;
  }

  async create(name) {
    return this._Category.create({name});
  }

  async findPage(categoryId, limit, offset) {
    const articlesIdByCategory = await this._ArticleCategory.findAll({
      attributes: [`ArticleId`],
      where: {
        CategoryId: categoryId
      },
      raw: true
    });

    const articlesId = articlesIdByCategory.map((articleIdItem) => articleIdItem.ArticleId);

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        Alias.CATEGORIES,
        Alias.COMMENTS,
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        id: articlesId
      },
      distinct: true
    });

    return {count, articlesByCategory: rows};
  }
}

module.exports = CategoryService;

