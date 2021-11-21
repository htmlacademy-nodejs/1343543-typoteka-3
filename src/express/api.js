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

  getArticles({offset, limit, comments}) {
    return this._load(`/articles`, {params: {offset, limit, comments}});
  }

  getArticlesWithCategory(id) {
    return this._load(`/articles/category/${id}`);
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories({withCount}) {
    return this._load(`/category`, {params: {withCount}});
  }

  getCategory({categoryId, limit, offset}) {
    return this._load(`/category/${categoryId}`, {params: {limit, offset}});
  }

  getNewComments() {
    return this._load(`/articles/comments`);
  }

  getMostCommented() {
    return this._load(`/articles/test`);
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

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
