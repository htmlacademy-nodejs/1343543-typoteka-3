'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {

  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  // /////
  // Статьи
  // /////

  // получить все статьи
  getArticles({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  // получить все статьи одной категории
  getArticlesByCategory({categoryId, limit, offset}) {
    return this._load(`/articles/category/${categoryId}`, {params: {limit, offset}});
  }

  // получить список наиболее комментируемых
  getMostCommented() {
    return this._load(`/articles/test`);
  }

  // получить одну статью
  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  // удалить статью
  removeArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  // создать статью
  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  // править статью
  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  // /////
  // Поиск
  // /////

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  // /////
  // Комментарии
  // /////

  // получить список последних комментариев
  getNewComments() {
    return this._load(`/articles/comments`);
  }

  // получить все комментарии
  getComments() {
    return this._load(`/articles/comments2`);
  }

  // удалить комментарий
  removeComment(id) {
    return this._load(`/articles/comments/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  // добавить комментариий
  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  // /////
  // Категории
  // /////

  // получить список всех категорий
  getCategories({withCount} = {}) {
    return this._load(`/category`, {params: {withCount}});
  }

  // получить данные об одной категории
  getCategory(id) {
    return this._load(`/category/${id}`);
  }

  // Добавляет категорию
  createCategory(data) {
    return this._load(`/category`, {
      method: HttpMethod.POST,
      data: {data}
    });
  }

  // Удаляет категорию
  removeCategory(id, data) {
    return this._load(`/category/${id}`, {
      method: HttpMethod.DELETE,
      data: {data}
    });
  }

  // Переименовывает категорию
  renameCategory(id, data) {
    return this._load(`/category/${id}`, {
      method: HttpMethod.PUT,
      data: {data}
    });
  }

  // /////
  // Аутентификация
  // /////

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }

}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
