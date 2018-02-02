const Prismic = require('prismic-nodejs');
const PrismicConfig = require('./prismic-configuration');

module.exports = function (app) {
  // Middleware to inject prismic context
  app.use((req, res, next) => {
    res.locals.ctx = {
      endpoint: PrismicConfig.apiEndpoint,
      linkResolver: PrismicConfig.linkResolver,
    };

    Prismic.api(PrismicConfig.apiEndpoint, {
      req,
    }).then((api) => {
      req.prismic = { api };
      next();
    }).catch((error) => {
      next(error.message);
    });
  });
}
