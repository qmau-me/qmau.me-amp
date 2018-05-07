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
 * Gallery Model
 * =============
 */

var Gallery = new keystone.List('Gallery', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Gallery.add({
	name: { type: String, required: true },
	publishedDate: { type: Date, default: Date.now },
	heroImage: {
		type: Types.File,
		storage: storage,
	},
	images: {
		type: Types.File,
		storage: storage,
		many: true,
	},
});

Gallery.register();
