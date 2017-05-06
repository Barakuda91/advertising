const includer  = require('./includer');
const loger     = includer.set('Loger',     require('./loger'));
const http      = includer.set('http',      require('http'));
const colors    = includer.set('colors',    require('colors'));
const config    = includer.set('config',    require('config'));
const md5       = includer.set('md5',       require('md5'));
const Router    = includer.set('Router',    require('router'));
const validator = includer.set('validator', require('validator'));
const ws        = includer.set('ws',        require('ws'));
const bodyParser    = includer.set('bodyParser',    require('body-parser'));
const finalhandler  = includer.set('finalhandler',  require('finalhandler'));
const jsonWebToken  = includer.set('jsonWebToken',  require('json-web-token'));


let router = new Router();
