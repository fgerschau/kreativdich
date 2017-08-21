const Prismic = require('prismic-nodejs');
const PrismicConfig = require('./prismic-configuration');
const Cookies = require('cookies');

module.exports = function (app) {
  // Middleware to inject prismic context
  app.use((req, res, next) => {
    res.locals.ctx = {
      endpoint: PrismicConfig.apiEndpoint,
      linkResolver: PrismicConfig.linkResolver,
    };

    Prismic.api(PrismicConfig.apiEndpoint, {
      accessToken: PrismicConfig.accessToken,
      req,
    }).then((api) => {
      req.prismic = { api };
      next();
    }).catch((error) => {
      next(error.message);
    });
  });
}
