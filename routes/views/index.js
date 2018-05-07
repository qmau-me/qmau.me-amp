var keystone = require('keystone');
var async = require('async');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		s: req.query.s,
	};
	locals.data = {
		posts: [],
		topPosts: [],
		recentPosts: [],
		categories: [],
		s: req.query.s,
	};

	// Load all categories
	view.on('init', function (next) {

		keystone.list('PostCategory').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			// Load the counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Post').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.postCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
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
			.exec(function (err, posts) {
				locals.data.recentPosts = posts.slice(0, 5);
				locals.data.posts = posts;
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
	// Render the view
	view.render('index');
};
