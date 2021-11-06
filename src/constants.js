'use strict';

const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;

const MAX_ID_LENGTH = 6;
const MAX_COMMENTS = 3;

const API_PREFIX = `/api`;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const WrapperClass = {
  COLOR: `wrapper-color`,
  NO_BACKGROUND: `wrapper wrapper--nobackground`,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  API_PREFIX,
  ExitCode,
  HttpCode,
  HttpMethod,
  WrapperClass,
  Env
};
