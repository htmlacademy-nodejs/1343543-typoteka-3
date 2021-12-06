'use strict';

const {Model} = require(`sequelize`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);
const Alias = require(`./alias`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `articleId`});
  Comment.belongsTo(Article, {as: Alias.ARTICLES, foreignKey: `articleId`});

  ArticleCategory.init({}, {sequelize});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Alias.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Alias.ARTICLES});
  Article.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES});
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES});

  User.hasMany(Article, {as: Alias.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Alias.USERS, foreignKey: `userId`});

  User.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Alias.USERS, foreignKey: `userId`});

  return {Category, Comment, Article, User, ArticleCategory};
};

module.exports = define;


