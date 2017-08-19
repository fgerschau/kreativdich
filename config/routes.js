'use strict';
const Prismic = require('prismic-nodejs');

module.exports = function (app) {
  app.route('/').get((req, res) => {
    const ctx = res.locals.ctx;
    req.prismic.api.getSingle('homepage').then((prismicdoc) => {
      res.render('index', { pagecontent: prismicdoc, ctx });
    });
  });

  app.route('/blog').get((req, res) => {
    if (!req.query.page) {
      return res.redirect('/blog?page=1');
    }

    const blogType = Prismic.Predicates.at('document.type', 'blog-post');
    const options = {
      pageSize: 6,
      page: req.query.page || 1,
      orderings: '[document.first_publication_date desc]',
    };

    req.prismic.api.query(blogType, options).then((prismicdoc) => {
      const posts = [];
      for (let i = 0; i < prismicdoc.results.length; i++) {
        const title = prismicdoc.results[i].getText('blog-post.title');
        const image = prismicdoc.results[i].getImage('blog-post.title-image');
        const imageUrl = image ? image.url : null;
        const uid = prismicdoc.results[i].uid;
        posts.push({ title, imageUrl, uid });
      }

      const paginationOptions = {
        page: prismicdoc.page,
        pageSize: prismicdoc.results_per_page,
        results: prismicdoc.total_results_size,
        totalPages: prismicdoc.total_pages,
      };

      res.render('blogList', { posts, paginationOptions });
    });
  });

  app.route('/blog/:uid').get((req, res) => {
    req.prismic.api.getByUID('blog-post', req.params.uid).then((prismicdoc) => {
      const ctx = res.locals.ctx;
      const post = {
        title: prismicdoc.getText('blog-post.title'),
        imageUrl: prismicdoc.getImage('blog-post.title-image') ? prismicdoc.getImage('blog-post.title-image').url : '',
        text: prismicdoc.getStructuredText('blog-post.text') ? prismicdoc.getStructuredText('blog-post.text').asHtml(ctx) : null,
        keywords: prismicdoc.getText('blog-post.keywords') || null,
      }

      res.render('blog', { post });
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
