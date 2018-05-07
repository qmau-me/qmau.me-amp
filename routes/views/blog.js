var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category,
	};
	locals.data = {
		posts: [],
		recentPosts: [],
		topPosts: [],
		allTags: [],
	};

	// Load the current category filter
	view.on('init', function (next) {

		if (req.params.category) {
			keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the posts
	view.on('init', function (next) {
		keystone.list('Post').model.find()
			.where('state', 'published')
			.populate('author categories tags')
			.sort('-views')
			.limit(5)
			.exec(function (err, posts) {
				locals.data.topPosts = posts;
				next(err);
			});
	});

	view.on('init', function (next) {
		keystone.list('Post').model.find()
			.where('state', 'published')
			.populate('author categories tags')
			.sort('-_id')
			.limit(5)
			.exec(function (err, posts) {
				locals.data.recentPosts = posts;
				next(err);
			});
	});


	view.on('init', function (next) {
		keystone.list('PostTag').model.find()
			.sort('-_id')
			.exec(function (err, tags) {
				locals.data.allTags = tags;
				next(err);
			});
	});

	view.on('init', function (next) {

		var q = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 30,
			maxPages: 10,
			filters: {
				state: 'published',
				categories: locals.data.category.id,
			},
		})
			.sort('-publishedDate')
			.populate('author categories tags');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// Render the view
	view.render('blog');
};
