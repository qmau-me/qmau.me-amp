var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post,
	};
	locals.data = {
		posts: [],
		tags: [],
		recentPosts: [],
		topPosts: [],
		allTags: [],
	};

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post,
		}).populate('author categories tags');

		q.exec(function (err, result) {
			result.views += 1;
			result.save();
			locals.data.post = result;
			next(err);
		});

	});

	view.on('init', function (next) {
		keystone.list('Post').model.find({ _id: { $gt: locals.data.post._id } })
			.sort({ _id: 1 })
			.where('state', 'published')
			.limit(1)
			.exec(function (err, post) {
				locals.data.nextPost = post;
				next(err);
			});
	});

	view.on('init', function (next) {
		keystone.list('Post').model.find({ _id: { $lt: locals.data.post._id } })
			.sort({ _id: -1 })
			.where('state', 'published')
			.limit(1)
			.exec(function (err, post) {
				locals.data.prevPost = post;
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
		keystone.list('PostTag').model.find()
			.sort('-_id')
			.exec(function (err, tags) {
				locals.data.allTags = tags;
				next(err);
			});
	});

	// Render the view
	view.render('post');
};
