'use strict';

const axios = require(`axios`);

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

  async _post() {
    const response = await this._http.request({
      url: `/articles`,
      method: `POST`,
      data: {
        category: [`Котики`],
        title: `Дам погладить котика`,
        announce: `Дам погладить котика`,
        fullText: `Дам погладить котика. Дорого. Не гербалайф`,
        createdDate: `2021-05-18T05:51:04.976Z`
      }
    });
    return response.data;
  }


  getArticles() {
    return this._load(`/articles`);
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  // TODO а почему эти метод async а другие нет?
  async getCategories() {
    return this._load(`/category`);
  }

  async createArticle(data) {
    return this._post;
    // return this._load(`/articles`, {
    //   method: `POST`,
    //   data: {
    //     category: [`Котики`],
    //     title: `Дам погладить котика`,
    //     announce: `Дам погладить котика`,
    //     fullText: `Дам погладить котика. Дорого. Не гербалайф`,
    //     createdDate: `2021-05-18T05:51:04.976Z`
    //   }
    // });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
