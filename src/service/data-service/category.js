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

  // /////
  // чтение
  // /////

  /**
   * Получает все категории
   * @param  {Boolean} withCount - нужно ли подсчитывать количетсво статей
   * @return {Array} - массив объектов с категориями
   */
  async findAll({withCount}) {
    if (withCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`CategoryId`)
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

  /**
   * Получает одну категорию с возможностью подсчета статей в ней
   * @param {Number} id - id категории
   * @param {Boolean} withCount - нужно ли подсчитывать количетсво статей
   * @return {Array} - массив с информацией о категории
   */
  async findOne({id, withCount}) {
    if (withCount) {
      const result = await this._Category.findByPk(id, {
        where: {id},
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`CategoryId`)
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
    } else {
      return this._Category.findByPk(id);
    }
  }

  // /////
  // запись
  // /////

  /**
   * Создает категорию
   * @param {String} name - имя категории
   * @return {Object} - объект с результатом операции
   */
  async create(name) {
    return this._Category.create({name});
  }

  /**
   * Удаляет категорию
   * @param {Number} id - id категории
   * @return {Boolean} - результат операции
   */
  async drop(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  /**
   * Переименовывает категорию
   * @param {Number} id - id категории
   * @param {String} categoryName - новое имя категории
   * @return {Object} - результат операции
   */
  async update(id, categoryName) {
    const updatedRows = await this._Category.update({
      name: categoryName
    }, {
      where: {id}
    });

    return updatedRows;
  }
}

module.exports = CategoryService;

