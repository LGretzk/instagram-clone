const Post = require("../models/post");
// const path = require("path");
const Resize = require("../Resize");
const receiveImage = require('../uploadMiddleware');
const {uploadImage} = require('../utilities/cloudinaryUtil');

const PostsController = {
  Index: (req, res) => {
    Post.find((err, posts) => {
      if (err) {
        throw err;
      }

      res.render("posts/index", { posts: posts });
    });
  },
  New: (req, res) => {
    res.render("posts/new", {});
  },
  Create: (req, res) => {
    const post = new Post(req.body);
    post.save((err) => {
      if (err) {
        throw err;
      }

      res.status(201).redirect("/posts");
    });
  },

  Upload: (req, res) => {
    receiveImage(req, res, async (err) => {
      // handling errors from multer
      if (err) {
        return res.status(401).json({ error: err.message });
      }

      try {
        // format the image with sharp (i.e. Resize class)
        console.log(req.body.message)
        const file = new Resize();
        const fileToUpload = await file.format(req.file.buffer);

        if(!fileToUpload) {
          return res.status(401).json({ error: 'Image could not be formatted'});
        }
        // upload to cloudinary
        const imageStream = fileToUpload.formattedFile;
        const imageName = fileToUpload.fileName;

        const uploadResult = await uploadImage(imageStream, imageName); 
        const uploadUrl = uploadResult.url;

        // return res.status(201).redirect("/posts/new/?pic_url=" + uploadUrl)
        return res.status(201).redirect("/posts/new");
        
      } catch (error) {
        return res.json({error: 'Failed to upload'})
      }
    });
  },
};

module.exports = PostsController;
