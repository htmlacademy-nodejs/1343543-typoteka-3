'use strict';

const {Model} = require(`sequelize`);

class ArticleCategory extends Model {

}
const define = (sequelize) => ArticleCategory.init({}, {sequelize});

module.exports = define;
