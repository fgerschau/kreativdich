'use strict';
const controller = require('../app/controller');

module.exports = function (app) {
  app.route('/').get(controller.getIndex);

  app.route('/blog').get(controller.getBlogList);

  app.route('/blog/:uid').get(controller.getPost);

  app.get('/preview', controller.preview)
}
