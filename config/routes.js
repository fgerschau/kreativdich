module.exports = function (app) {
  app.route('/').get(function(req, res) {
    const ctx = res.locals.ctx;
    req.prismic.api.getSingle('homepage').then((prismicdoc) => {
      res.render('index', { pagecontent: prismicdoc, ctx });
    });
  });

  /*
   * Preconfigured prismic preview
   */
  app.get('/preview', (req, res) => {
    const token = req.query.token;
    if (token) {
      req.prismic.api.previewSession(token, PrismicConfig.linkResolver, '/')
      .then((url) => {
        const cookies = new Cookies(req, res);
        cookies.set(Prismic.previewCookie, token, { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false });
        res.redirect(302, url);
      }).catch((err) => {
        res.status(500).send(`Error 500 in preview: ${err.message}`);
      });
    } else {
      res.send(400, 'Missing token from querystring');
    }
  });
}
