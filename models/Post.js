var keystone = require('keystone');
var Types = keystone.Field.Types;

var storage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: keystone.expandPath('./public/uploads'),
		publicPath: '/uploads/',
	},
	schema: {
		originalname: true,
		url: true,
	},
});

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: {
		type: Types.File,
		storage: storage,
	},
	content: {
		brief: { type: Types.Markdown, html: String, md: String, height: 400, toolbarOptions: { hiddenButtons: 'H1,H6,Code' } },
		extended: { type: Types.Markdown, html: String, md: String, height: 400, toolbarOptions: { hiddenButtons: 'H1,H6,Code' } },
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	tags: { type: Types.Relationship, ref: 'PostTag', many: true },
	views: { type: Number, default: 0 },
	img: { type: Types.Boolean, default: true },
	// imgType: { type: Types.Select, options: 'none, image, vertical, horizontal', default: 'none' },
});

Post.schema.virtual('content.full').get(function () {
	return this.content.extended.html || this.content.brief.html;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
