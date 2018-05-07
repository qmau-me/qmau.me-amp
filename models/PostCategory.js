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
/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

PostCategory.add({
	name: { type: String, required: true },
	image: {
		type: Types.File,
		storage: storage,
	},
	description: { type: String },
});

PostCategory.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' });

PostCategory.register();
