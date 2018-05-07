var keystone = require('keystone');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.data = {
		posts: [],
		topPosts: [],
		recentPosts: [],
		categories: [],
	};

	// Init locals
	locals.section = 'list';
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

	// Load all categories
	// Render the view
	view.render('list');
};
