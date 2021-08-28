'use strict';

const express = require(`express`);
const path = require(`path`);

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const DEFAULT_PORT = 8080;

const articlesRouter = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates/views`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRouter);

app.listen(DEFAULT_PORT);
