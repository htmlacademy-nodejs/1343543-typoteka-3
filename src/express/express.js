'use strict';

const express = require(`express`);
const session = require(`express-session`);
const path = require(`path`);
const {HttpCode} = require(`../constants`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const methodOverride = require('method-override');

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const DEFAULT_PORT = 8080;

const articlesRouter = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();
app.use(methodOverride(`_method`));

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));


app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.set(`views`, path.resolve(__dirname, `templates/views`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRouter);

// app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));

// app.use((err, _req, res, _next) => {
//   res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
// });

app.listen(process.env.PORT || DEFAULT_PORT);
