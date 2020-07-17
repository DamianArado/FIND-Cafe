const Post = require('../models/post');
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'humayun7',
	api_key: '861512862438981',
	api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {
	// Posts Index
	async postIndex(req, res, next) {
		let posts = await Post.find({});
		res.render('posts/index', { posts });
	},
	// Posts New
	postNew(req, res, next) {
		res.render('posts/new');
	},
	// Posts Create
	async postCreate(req, res, next) {
		req.body.post.images = [];
		for(const file of req.files) {
			let image = await cloudinary.v2.uploader.upload(file.path);
			req.body.post.images.push({
				url: image.secure_url,
				public_id: image.public_id
			});
		}
		let post = await Post.create(req.body.post);
		res.redirect(`/posts/${post.id}`);
	},
	// Posts Show
	async postShow(req, res, next) {
		let post = await Post.findById(req.params.id);
		res.render('posts/show', { post });
	},
	// Posts Edit
	async postEdit(req, res, next) {
		let post = await Post.findById(req.params.id);
		res.render('posts/edit', { post });
	},
	// Posts Update
	async postUpdate(req, res, next) {
		//find post by id
		let post = await Post.findById(req.params.id);
		//check if there are any images for deletion
		if(req.body.deleteImages && req.body.deleteImages.length){
			//assign delete images from req.body to it's own variable
			let deleteImages = req.body.deleteImages;
			// [ 'f4c10qgnlcu62rbtwzxw', 're9nj1hzbsqvnrkf01vx' ]
			//loop over delete images
			for(const public_id of deleteImages){
				//delete images from cloudinary
				await cloudinary.v2.uploader.destroy(public_id);
				//delete image from post.images
				for(const image of post.images){
					if(image.public_id === public_id){
						let index = post.image.indexOf(image);
						post.images.splice(index , 1);
					}
				}
			}
		}
		//check if there are any new images for upload
		if( req.files ){
		for(const file of req.files) {
			let image = await cloudinary.v2.uploader.upload(file.path);
			//add images to post.images array
			post.images.push({
				url: image.secure_url,
				public_id: image.public_id
			});
		}
	}
		//update the post with any new properties
		post.title = req.body.post.title;
		post.description = req.body.post.description;
		post.price = req.body.post.price;
		post.location = req.body.post.location;
		//save the updated post into the database
		post.save();
		//redirect to the show page 
		res.redirect(`/posts/${post.id}`);
	},
	// Posts Destroy
	async postDestroy(req, res, next) {
		await Post.findByIdAndRemove(req.params.id);
		res.redirect('/posts');
	}
}
